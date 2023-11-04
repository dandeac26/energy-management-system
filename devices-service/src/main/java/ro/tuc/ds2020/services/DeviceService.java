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

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
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

        return existingDevice.getId();
    }

    public void delete(UUID deviceId) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (deviceOptional.isPresent()) {
            deviceRepository.delete(deviceOptional.get());
            LOGGER.debug("Device with id {} was deleted from the database", deviceId);
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


//        Optional<Device> prosumerOptional = deviceRepository.findDevicesByUserId(userId);
//        if (!prosumerOptional.isPresent()) {
//            LOGGER.error("Device with id {} was not found in db", userId);
//            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + userId);
//        }
//        return DeviceBuilder.toDeviceDetailsDTO(prosumerOptional.get());

}
