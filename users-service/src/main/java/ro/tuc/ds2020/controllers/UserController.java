package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.jwt.JwtUtil;
import ro.tuc.ds2020.request.AuthRequest;
import ro.tuc.ds2020.response.JwtResponse;
import ro.tuc.ds2020.services.UserService;
import org.springframework.validation.BindingResult;


import javax.validation.Valid;
import java.util.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import BCrypt

@RestController
@CrossOrigin
@RequestMapping(value = "/user")
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> dtos = userService.findUsers();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<?> insertUser(@Valid @RequestBody UserDetailsDTO userDTO, BindingResult bindingResult) {

        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
//        System.out.println(userDTO.getPassword());
        UUID userID = userService.insert(userDTO, bindingResult);

        if (userID == null) {
            return new ResponseEntity<>("Validation failed or invalid role", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(userID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable("id") UUID userId) {
        UserDTO dto = userService.findUserById(userId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UUID> updateUser(@PathVariable("id") UUID userId, @Valid @RequestBody UserDetailsDTO updatedUserDTO) {
        UUID updatedUserId = userService.update(userId, updatedUserDTO);
        return new ResponseEntity<>(updatedUserId, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") UUID userId) {
        userService.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createToken(@RequestBody AuthRequest authRequest) {
        UserDetailsDTO userDTO = new UserDetailsDTO(authRequest.getUsername(), authRequest.getPassword());

        Optional<UserDTO> optionalUserDTO = userService.authenticate(userDTO);

        if (optionalUserDTO.isPresent()) {
            UserDTO authenticatedUser = optionalUserDTO.get();
            List<String> roles = Collections.singletonList(authenticatedUser.getRole().toUpperCase());
            String jwt = jwtUtil.generateToken(authenticatedUser.getName(), roles);
            return ResponseEntity.ok(new JwtResponse(jwt, authenticatedUser.getName(), roles));
        } else {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid credentials"));
        }
    }

}
