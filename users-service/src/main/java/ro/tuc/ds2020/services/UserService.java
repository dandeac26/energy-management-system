package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.dtos.builders.UserBuilder;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.repositories.UserRepository;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import BCrypt

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Create a password encoder

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

//    @Autowired
//    public UserService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }

    public List<UserDTO> findUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findUserById(UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (prosumerOptional.isEmpty()) {  /// change to this if (!prosumerOptional.isPresent()) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserBuilder.toUserDTO(prosumerOptional.get());
    }

    public UUID insert(UserDetailsDTO userDTO, BindingResult bindingResult) {

        if (userRepository.existsByName(userDTO.getName())) {
            LOGGER.error("User with name {} already exists", userDTO.getName());
            return UUID.fromString("00000000-0000-0000-0000-000000000000");
        }


        if (bindingResult.hasErrors()) {
            LOGGER.error("Validation errors in UserDetailsDTO: {}", bindingResult.getAllErrors());
            return UUID.fromString("11111111-1111-1111-1111-111111111111");
        }


        if (!isValidRole(userDTO.getRole())) {
            LOGGER.error("Invalid role value: {}", userDTO.getRole());
            return UUID.fromString("22222222-2222-2222-2222-222222222222");
        }

        User user = UserBuilder.toEntity(userDTO);

        user = userRepository.save(user);
        LOGGER.debug("User with id {} was inserted in db", user.getId());
        return user.getId();
    }

    private boolean isValidRole(String role) {
        return "client".equals(role) || "admin".equals(role);
    }

    @Transactional
    public UUID update(UUID userId, UserDetailsDTO updatedUserDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            LOGGER.error("User with id {} was not found in db", userId);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + userId);
        }

        User existingUser = userOptional.get();

        existingUser.setName(updatedUserDTO.getName());
        existingUser.setPassword(passwordEncoder.encode(updatedUserDTO.getPassword()));
        existingUser.setRole(updatedUserDTO.getRole());
        existingUser = userRepository.save(existingUser);

        LOGGER.debug("User with id {} was updated in db", existingUser.getId());

        return existingUser.getId();
    }

    public void delete(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            LOGGER.debug("User with id {} was deleted from the database", userId);
        } else {
            LOGGER.error("User with id {} was not found in db and could not be deleted", userId);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + userId);
        }
    }

//    public UserDTO authenticate(UserDetailsDTO userDTO) {
//
//        User user = userRepository.findByName(userDTO.getName());
//
//        if (user == null) {
//            System.out.println("search by name failed");
//
//            return null;
//        }
//        System.out.println(userDTO.getPassword() + " vs " + user.getPassword());
//
//        if (passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
//
//            System.out.println("success");
//            return UserBuilder.toUserDTO(user);
//
//        } else {
//            System.out.println("pass doens't match");
//            return null;
//        }
//    }

    public Optional<UserDTO> authenticate(UserDetailsDTO userDTO) {
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByName(userDTO.getName()));

        return userOptional
                .filter(user -> passwordEncoder.matches(userDTO.getPassword(), user.getPassword()))
                .map(UserBuilder::toUserDTO);
    }

}
