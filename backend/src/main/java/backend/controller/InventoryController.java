package backend.controller;

import backend.DTO.InventoryRequest;  // Changed from backend.dto to backend.DTO
import backend.model.Inventory;
import backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    // Define upload directory for images
    private static final String UPLOAD_DIR = "./uploads/";

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        List<Inventory> inventory = inventoryRepository.findAll();
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/recipeImage")
    public ResponseEntity<?> uploadRecipeImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new HashMap<String, String>() {{ put("message", "Please select a file to upload"); }});
        }

        try {
            // Create the upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Return the URL or path to the saved image
            // In a real application, this would be a publicly accessible URL
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileName); // Return only the filename
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new HashMap<String, String>() {{ put("message", "Failed to upload image: " + e.getMessage()); }});
        }
    }

    @PostMapping
    public ResponseEntity<Inventory> createInventory(@RequestBody InventoryRequest inventoryRequest) {
        // Map InventoryRequest to Inventory entity
        Inventory inventory = new Inventory();
        inventory.setName(inventoryRequest.getName());
        inventory.setCategory(inventoryRequest.getCategory());
        inventory.setQuantity(inventoryRequest.getQuantity());
        inventory.setDescription(inventoryRequest.getDescription());
        inventory.setPrice(inventoryRequest.getPrice());
        inventory.setImageUrl(inventoryRequest.getImageUrl()); // Set the imageUrl

        Inventory savedInventory = inventoryRepository.save(inventory);
        return ResponseEntity.ok(savedInventory);
    }

    // ... other endpoints like PUT, DELETE, etc., will go here
}