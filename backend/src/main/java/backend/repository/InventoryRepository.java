package backend.repository;

import backend.model.InventoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.repository.CrudRepository; // This import is not used

public interface InventoryRepository extends JpaRepository<InventoryModel, Long> {

}