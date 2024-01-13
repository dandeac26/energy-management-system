package ro.tuc.ds2020.dtos;

import java.util.UUID;

public class UsersIdsDTO {
    private UUID id;
    private UUID userId;
    private String username;

    public UsersIdsDTO(){

    }
    public UsersIdsDTO(UUID id, UUID userId, String username) {
        this.id = id;
        this.userId = userId;
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
