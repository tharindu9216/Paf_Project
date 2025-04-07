package backend.controller;

import backend.model.InventoryModel;
import backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // ✅ fixed typo here
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React frontend
@RequestMapping("/api")
public class InventoryController {

     @Autowired
     private InventoryRepository inventoryRepository;

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

     // ✅ NEW GET ENDPOINT to fetch all inventory items
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

               // ✅ Absolute path
               String uploadDir = "C:/Users/thari/Desktop/uploads/";
               Path uploadPath = Paths.get(uploadDir);

               if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
               }

               String originalFilename = file.getOriginalFilename();
               if (originalFilename == null || originalFilename.isEmpty()) {
                    return new ResponseEntity<>("Invalid file name", HttpStatus.BAD_REQUEST);
               }

               String fileExtension = "";
               int lastDotIndex = originalFilename.lastIndexOf(".");
               if (lastDotIndex > 0) {
                    fileExtension = originalFilename.substring(lastDotIndex);
               }

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
}
