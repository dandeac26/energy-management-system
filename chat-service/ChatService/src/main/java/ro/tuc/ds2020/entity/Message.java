package ro.tuc.ds2020.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class Message implements Serializable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(name = "Text", nullable = false)
    private String text;

    @Column(name = "Sender", nullable = false)
    private String sender;
    @Column(name = "Destination", nullable = false)
    private String destination;
    @Column(name = "Seen", nullable = true)
    private Boolean isSeen;

    @Column(name = "Role", nullable = false)
    private String role;

    public Message(UUID id, String text, String sender, String destination, Boolean isSeen, String role) {
        this.id = id;
        this.text = text;
        this.sender = sender;
        this.destination = destination;
        this.isSeen = isSeen;
        this.role = role;
    }

    public Message() {

    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public Boolean getSeen() {
        return isSeen;
    }

    public void setSeen(Boolean seen) {
        isSeen = seen;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
