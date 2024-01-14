package ro.tuc.ds2020.dtos;


import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.UUID;

public class DeviceDetailsDTO {

    private UUID id;
    @NotNull
    private String description;
    @NotNull
    private String address;

    private int hourlyMaxConsumption;

    @NotNull
    private UUID userId;
    public DeviceDetailsDTO() {
    }

    public DeviceDetailsDTO( String description, String address, int hourlyMaxConsumption) {
        this.description = description;
        this.address = address;
        this.hourlyMaxConsumption = hourlyMaxConsumption;
    }

    public DeviceDetailsDTO(UUID id, String description, String address, int hourlyMaxConsumption) {
        this.id = id;
        this.description = description;
        this.address = address;
        this.hourlyMaxConsumption = hourlyMaxConsumption;
    }

    public DeviceDetailsDTO(UUID id, String description, String address, int hourlyMaxConsumption, UUID userId) {
        this.id = id;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDetailsDTO that = (DeviceDetailsDTO) o;
        return hourlyMaxConsumption == that.hourlyMaxConsumption &&
                Objects.equals(description, that.description) &&
                Objects.equals(address, that.address) &&
                Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(description, address, hourlyMaxConsumption, userId);
    }
}
