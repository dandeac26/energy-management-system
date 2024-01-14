package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.UsersIdsDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.UsersIds;
import ro.tuc.ds2020.repositories.DeviceRepository;
import ro.tuc.ds2020.repositories.UsersIdsRepository;

import java.util.Optional;
import java.util.UUID;
import ro.tuc.ds2020.dtos.builders.UsersIdsBuilder;
@Service
public class UsersIdsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UsersIdsService.class);
    private final UsersIdsRepository usersIdsRepository;

    @Autowired
    public UsersIdsService(UsersIdsRepository usersIdsRepository) {
        this.usersIdsRepository = usersIdsRepository;
    }

    public UUID insertUserId(UsersIdsDetailsDTO usersIdsDTO) {
        UsersIds usersIds = UsersIdsBuilder.toEntity(usersIdsDTO);
        usersIds = usersIdsRepository.save(usersIds);
        System.out.println("User " + usersIds.getUsername() + " with id "+ usersIds.getUserId() +" was inserted in db");
        LOGGER.debug("UsersIds with id {} was inserted in db", usersIds.getId());
        return usersIds.getUserId();
    }

    public void deleteUserId(UUID userId) {
        Optional<UsersIds> usersIdsOptional = usersIdsRepository.findByUserId(userId);
        if (usersIdsOptional.isPresent()) {
            usersIdsRepository.delete(usersIdsOptional.get());
            LOGGER.debug("Device with id {} was deleted from the database", userId);
        } else {
            LOGGER.error("Device with id {} was not found in db and could not be deleted", userId);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + userId);
        }
    }
}
