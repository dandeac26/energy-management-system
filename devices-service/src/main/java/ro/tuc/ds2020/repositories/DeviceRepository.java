package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entities.Device;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {

    @Query(value = "SELECT p " +
            "FROM Device p " +
            "WHERE p.userId = :userId ")
    List<Device> findDevicesByUserId(@Param("userId") UUID userId);
}
