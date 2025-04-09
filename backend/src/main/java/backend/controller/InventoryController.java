package backend.controller;

import backend.model.InventoryModel;
import backend.repository.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class InventoryController {

     @Autowired
     private InventoryRepository inventoryRepository;

     private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

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

     @GetMapping("/inventory")
     public ResponseEntity<?> getAllInventory() {
          return new ResponseEntity<>(inventoryRepository.findAll(), HttpStatus.OK);
     }

     @PostMapping("/inventory/recipeImage")
     public ResponseEntity<String> uploadRecipeImage(@RequestParam("file") MultipartFile file) {
          try {
               if (file == null || file.isEmpty()) {
                    return new ResponseEntity<>("No file selected", HttpStatus.BAD_REQUEST);
               }

               Path uploadPath = Paths.get(UPLOAD_DIR);
               if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
               }

               String originalFilename = file.getOriginalFilename();
               if (originalFilename == null || originalFilename.isEmpty()) {
                    return new ResponseEntity<>("Invalid file name", HttpStatus.BAD_REQUEST);
               }

               String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
               if (!fileExtension.equalsIgnoreCase(".jpg") &&
                       !fileExtension.equalsIgnoreCase(".png") &&
                       !fileExtension.equalsIgnoreCase(".jpeg")) {
                    return new ResponseEntity<>("Only image files (jpg, jpeg, png) are allowed", HttpStatus.BAD_REQUEST);
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

     @GetMapping("/inventory/{id}")
     public ResponseEntity<InventoryModel> getItemById(@PathVariable UUID id) {
          return inventoryRepository.findById(id)
                  .map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
     }

     @GetMapping("/uploads/{filename}")
     public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
          File file = new File(UPLOAD_DIR + filename);
          if (!file.exists()) {
               return ResponseEntity.notFound().build();
          }
          return ResponseEntity.ok(new FileSystemResource(file));
     }

     @PutMapping("/inventory/{id}")
     public ResponseEntity<?> updateItem(
             @RequestPart(value = "recipeDetails") String recipeDetails,
             @RequestPart(value = "file", required = false) MultipartFile file,
             @PathVariable UUID id
     ) {
          try {
               if (!inventoryRepository.existsById(id)) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Item not found with id: " + id);
               }

               ObjectMapper mapper = new ObjectMapper();
               InventoryModel newInventoryModel = mapper.readValue(recipeDetails, InventoryModel.class);

               InventoryModel existingInventory = inventoryRepository.findById(id).get();
               existingInventory.setRecipeId(newInventoryModel.getRecipeId());
               existingInventory.setRecipeName(newInventoryModel.getRecipeName());
               existingInventory.setRecipeCategory(newInventoryModel.getRecipeCategory());
               existingInventory.setRecipeQty(newInventoryModel.getRecipeQty());
               existingInventory.setRecipeDetails(newInventoryModel.getRecipeDetails());
               existingInventory.setRecipePrice(newInventoryModel.getRecipePrice());

               if (file != null && !file.isEmpty()) {
                    String folder = UPLOAD_DIR;
                    String fileExtension = file.getOriginalFilename().substring(
                            file.getOriginalFilename().lastIndexOf("."));
                    String recipeImage = UUID.randomUUID().toString() + fileExtension;

                    try {
                         file.transferTo(Paths.get(folder + recipeImage));
                         existingInventory.setRecipeImage(recipeImage);
                    } catch (IOException e) {
                         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error saving recipe image: " + e.getMessage());
                    }
               }

               InventoryModel updatedInventory = inventoryRepository.save(existingInventory);
               return ResponseEntity.ok(updatedInventory);
          } catch (Exception e) {
               e.printStackTrace();
               return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                       .body("Error updating item: " + e.getMessage());
          }
     }

     @DeleteMapping("/inventory/{id}")
     public ResponseEntity<?> deleteItem(@PathVariable UUID id) {
          try {
               if (!inventoryRepository.existsById(id)) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Item not found with id: " + id);
               }

               InventoryModel itemToDelete = inventoryRepository.findById(id).get();

               if (itemToDelete.getRecipeImage() != null) {
                    String imagePath = UPLOAD_DIR + itemToDelete.getRecipeImage();
                    File imageFile = new File(imagePath);
                    if (imageFile.exists()) {
                         boolean isDeleted = imageFile.delete();
                         if (!isDeleted) {
                              return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                      .body("Failed to delete image file.");
                         }
                    }
               }

               inventoryRepository.deleteById(id);
               return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Item deleted successfully.");
          } catch (Exception e) {
               e.printStackTrace();
               return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                       .body("Error deleting item: " + e.getMessage());
          }
     }
}
