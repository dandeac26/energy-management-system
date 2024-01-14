package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.UsersIds;

import java.util.Optional;
import java.util.UUID;

public interface UsersIdsRepository extends JpaRepository<UsersIds, UUID> {
    Optional<UsersIds> findByUserId(UUID userId);

    Optional<UsersIds> findByUsername(String username);
}
