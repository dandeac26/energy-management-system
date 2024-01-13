package ro.tuc.ds2020.dtos;

import ro.tuc.ds2020.dtos.validators.annotation.AgeLimit;

import javax.validation.constraints.NotNull;
import java.util.UUID;

public class UserDetailsDTO {

    private UUID id;
    @NotNull
    private String name;
    @NotNull
    private String password;
    @NotNull
    private String role;



    public UserDetailsDTO() {
    }

    public UserDetailsDTO(String name, String password, String role) {
        this.name = name;
        this.password = password;
        this.role = role;
    }

    public UserDetailsDTO(UUID id, String name, String password,  String role) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    public UserDetailsDTO(String username, String password) {
        this.name = username;
        this.password = password;
    }

    public UUID getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
