package backend.repository;

import backend.model.InventoryModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InventoryRepository extends JpaRepository<InventoryModel, UUID> {
}
