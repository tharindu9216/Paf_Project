package backend.controller;

import backend.model.InventoryModel;
import backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Enable CORS for React frontend
@RequestMapping("/api")
public class InventoryController {

     @Autowired
     private InventoryRepository inventoryRepository;

     // Define dynamic upload directory (can be changed via application.properties)
     private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

     // POST method to add a new Inventory
     @PostMapping("/inventory")
     public ResponseEntity<?> newInventoryModel(@RequestBody InventoryModel newInventoryModel) {
          try {
               if (newInventoryModel == null) {
                    return new ResponseEntity<>("Request body cannot be null", HttpStatus.BAD_REQUEST);
               }

               InventoryModel savedInventory = inventoryRepository.save(newInventoryModel);
               return new ResponseEntity<>(savedInventory, HttpStatus.CREATED);
          } catch (Exception e) {
               e.printStackTrace();
               return new ResponseEntity<>("Error saving inventory: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
          }
     }

     // GET endpoint to fetch all inventory items
     @GetMapping("/inventory")
     public ResponseEntity<?> getAllInventory() {
          return new ResponseEntity<>(inventoryRepository.findAll(), HttpStatus.OK);
     }

     // POST method for uploading recipe image
     @PostMapping("/inventory/recipeImage")
     public ResponseEntity<String> uploadRecipeImage(@RequestParam("file") MultipartFile file) {
          try {
               if (file == null || file.isEmpty()) {
                    return new ResponseEntity<>("No file selected", HttpStatus.BAD_REQUEST);
               }

               // Create upload directory if it doesn't exist
               Path uploadPath = Paths.get(UPLOAD_DIR);
               if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
               }

               // Get the original file name and validate extension
               String originalFilename = file.getOriginalFilename();
               if (originalFilename == null || originalFilename.isEmpty()) {
                    return new ResponseEntity<>("Invalid file name", HttpStatus.BAD_REQUEST);
               }

               // Check if file is an image (optional)
               String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
               if (!fileExtension.equalsIgnoreCase(".jpg") && !fileExtension.equalsIgnoreCase(".png") && !fileExtension.equalsIgnoreCase(".jpeg")) {
                    return new ResponseEntity<>("Only image files (jpg, jpeg, png) are allowed", HttpStatus.BAD_REQUEST);
               }

               // Generate a unique file name to avoid collision
               String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
               Path filePath = uploadPath.resolve(uniqueFilename);
               file.transferTo(filePath.toFile());

               return new ResponseEntity<>(uniqueFilename, HttpStatus.OK);
          } catch (IOException e) {
               e.printStackTrace();
               return new ResponseEntity<>("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
          } catch (Exception e) {
               e.printStackTrace();
               return new ResponseEntity<>("An unexpected error occurred during image upload.", HttpStatus.INTERNAL_SERVER_ERROR);
          }
     }

     // GET endpoint to fetch an inventory item by ID
     @GetMapping("/inventory/{id}")
     public InventoryModel getItemId(@PathVariable Long id) {
          return inventoryRepository.findById(id).orElseThrow(() ->
                  new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found with id: " + id));
     }

     // Serve uploaded image
     @GetMapping("/uploads/{filename}")
     public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
          File file = new File(UPLOAD_DIR + filename);
          if (!file.exists()) {
               return ResponseEntity.notFound().build();
          }
          return ResponseEntity.ok(new FileSystemResource(file));
     }
}
