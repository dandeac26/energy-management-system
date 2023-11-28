package ro.tuc.ds2020.services;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.DeviceRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;
    private final RabbitTemplate rabbitTemplate;
    @Autowired
    public DeviceService(DeviceRepository deviceRepository, RabbitTemplate rabbitTemplate) {
        this.deviceRepository = deviceRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDetailsDTO findDeviceById(UUID id) {
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDetailsDTO(prosumerOptional.get());
    }

    public UUID insert(DeviceDetailsDTO deviceDTO) {
        Device device = DeviceBuilder.toEntity(deviceDTO);
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was inserted in db", device.getId());
        sendMessageToDeviceInsertion(device.getId(), device.getHourlyMaxConsumption());
        return device.getId();
    }

    @Transactional
    public UUID update(UUID deviceId, DeviceDetailsDTO updatedDeviceDTO) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", deviceId);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + deviceId);
        }

        Device existingDevice = deviceOptional.get();
        existingDevice.setUserId(updatedDeviceDTO.getUserId());
        existingDevice.setDescription(updatedDeviceDTO.getDescription());
        existingDevice.setHourlyMaxConsumption(updatedDeviceDTO.getHourlyMaxConsumption());
        existingDevice.setAddress(updatedDeviceDTO.getAddress());
        existingDevice = deviceRepository.save(existingDevice);

        LOGGER.debug("Device with id {} was updated in db", existingDevice.getId());
        sendMessageToDeviceDeletion(deviceId);
        sendMessageToDeviceInsertion(existingDevice.getId(), existingDevice.getHourlyMaxConsumption());
        return existingDevice.getId();
    }

    public void delete(UUID deviceId) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (deviceOptional.isPresent()) {
            deviceRepository.delete(deviceOptional.get());
            LOGGER.debug("Device with id {} was deleted from the database", deviceId);
            sendMessageToDeviceDeletion(deviceId);
        } else {
            LOGGER.error("Device with id {} was not found in db and could not be deleted", deviceId);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + deviceId);
        }
    }

    public List<DeviceDTO> findDevicesByUserId(UUID userId) {
        List<Device> deviceList = deviceRepository.findDevicesByUserId(userId);
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    private void sendMessageToDeviceDeletion(UUID deviceId) {
        // Prepare the message payload in JSON format
        String jsonMessage = "{\"operation\":\"delete\",\"deviceId\":\"" + deviceId.toString() + "\"}";

        // Publish the message to the "Sync" queue
        rabbitTemplate.convertAndSend("SyncExchange", "Sync", jsonMessage);
        System.out.println("MESSAGE SENT!!!:" + jsonMessage);
        LOGGER.debug("Message sent to RabbitMQ: {}", jsonMessage);
    }

    private void sendMessageToDeviceInsertion(UUID deviceId, int hourlyMaxConsumption) {
        // Prepare the message payload in JSON format
        String jsonMessage = "{\"operation\":\"insert\",\"deviceId\":\"" + deviceId.toString() + "\",\"max_measurement\":\"" + hourlyMaxConsumption + "\"}";

        // Publish the message to the "Sync" queue
        rabbitTemplate.convertAndSend("SyncExchange", "Sync", jsonMessage);
        System.out.println("MESSAGE SENT!!!:" + jsonMessage);
        LOGGER.debug("Message sent to RabbitMQ: {}", jsonMessage);
    }

//        Optional<Device> prosumerOptional = deviceRepository.findDevicesByUserId(userId);
//        if (!prosumerOptional.isPresent()) {
//            LOGGER.error("Device with id {} was not found in db", userId);
//            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + userId);
//        }
//        return DeviceBuilder.toDeviceDetailsDTO(prosumerOptional.get());

}
