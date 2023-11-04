package ro.tuc.ds2020.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class Device  implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "hourlyMaxConsumption", nullable = false)
    private int hourlyMaxConsumption;

    @Column(name = "userId", nullable = false)
    private UUID userId;

    public Device() {
    }

    public Device(String description, String address, int hourlyMaxConsumption, UUID userId) {
        this.description = description;
        this.address = address;
        this.hourlyMaxConsumption = hourlyMaxConsumption;
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getHourlyMaxConsumption() {
        return hourlyMaxConsumption;
    }

    public void setHourlyMaxConsumption(int hourlyMaxConsumption) {
        this.hourlyMaxConsumption = hourlyMaxConsumption;
    }
}