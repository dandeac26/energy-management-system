package ro.tuc.ds2020.dtos;

import java.util.UUID;

public class UsersIdsDTO {
    private UUID id;
    private UUID userId;

    public UsersIdsDTO(){

    }
    public UsersIdsDTO(UUID id, UUID userId) {
        this.id = id;
        this.userId = userId;
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
