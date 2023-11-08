package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.util.Objects;
import java.util.UUID;

public class DeviceDTO extends RepresentationModel<DeviceDTO> {
    private UUID id;
    private UUID userId;
    private String description;
    private String address;
    private int hourlyMaxConsumption;

    public DeviceDTO() {
    }

    public DeviceDTO(UUID id, String description, int hourlyMaxConsumption) {
        this.id = id;
        this.description = description;
        this.hourlyMaxConsumption = hourlyMaxConsumption;
    }
    public DeviceDTO(UUID id, UUID userId, String description, String address, int hourlyMaxConsumption) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.address = address;
        this.hourlyMaxConsumption = hourlyMaxConsumption;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
        DeviceDTO deviceDTO = (DeviceDTO) o;
        return hourlyMaxConsumption == deviceDTO.hourlyMaxConsumption &&
                Objects.equals(description, deviceDTO.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(description, hourlyMaxConsumption);
    }
}
