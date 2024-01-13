package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.tuc.ds2020.entity.Message;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Message, UUID> {

    /**
     * Example: JPA generate Query by Field
     */
//    List<Device> findByUserId(String name);

    /**
     * Example: Write Custom Query
     */
//    @Query(value = "SELECT p " +
//            "FROM Messages p " +
//            "WHERE p.userId = :userId ")
//    List<Messages> findDevicesByUserId(@Param("userId") UUID userId);
//    List<Device> findByUserId(UUID userId);


}