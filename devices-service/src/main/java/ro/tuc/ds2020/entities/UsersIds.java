package ro.tuc.ds2020.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Table(name = "UsersIds")
public class UsersIds {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;
    @Column(name = "userId", nullable = false)
    private UUID userId;
    @Column(name = "username", nullable = false)
    private String username;
    public UsersIds(){

    }
    public UsersIds(UUID userId){
        this.userId = userId;
    }
    public UsersIds(UUID id, UUID userId, String username) {
        this.id = id;
        this.userId = userId;
        this.username = username;
    }
    public UsersIds(UUID userId, String username) {
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

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }



}
