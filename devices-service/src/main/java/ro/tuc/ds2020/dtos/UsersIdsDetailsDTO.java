package ro.tuc.ds2020.dtos;

import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.UUID;

public class UsersIdsDetailsDTO {
    private UUID id;
    @NotNull
    private UUID userId;
    @NotNull
    private String username;

    public UsersIdsDetailsDTO() {

    }
    public UsersIdsDetailsDTO(UUID id, UUID userId, String username) {
        this.id = id;
        this.userId = userId;
        this.username = username;
    }
    public UsersIdsDetailsDTO(UUID userId, String username) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsersIdsDetailsDTO that = (UsersIdsDetailsDTO) o;
        return userId == that.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

}
