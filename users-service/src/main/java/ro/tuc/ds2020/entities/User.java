package ro.tuc.ds2020.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "Users")
public class User  implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
//    @Column(name="id", columnDefinition = "BINARY(16)") //THIS IS FOR MYSQL DATABASE, i use postgres!!
    private UUID id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role", nullable = false)
    @Pattern(regexp = "^(client|admin)$", message = "Invalid role value")
    private String role;

    public User() {
    }

    public User(String name, String password, String role) {
        this.name = name;
        this.password = password;
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UUID getId() {
        return id;
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
