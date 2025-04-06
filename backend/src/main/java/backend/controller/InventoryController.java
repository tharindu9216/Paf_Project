package backend.controller;

import backend.model.InventoryModel;
import backend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@RestController
@CrossOrigin("http://localhost:3000")
public class InventoryController {

     @Autowired
     private InventoryRepository inventoryRepository;

     @PostMapping("/inventory")
     public InventoryModel newInventoryModel(@RequestBody InventoryModel newInventoryModel) {
          return inventoryRepository.save(newInventoryModel);
     }

     @PostMapping("/inventory/recipeImage")
     public String recipeImage(@RequestParam("file") MultipartFile file) {
          String folder = "src/main/uploads/";  // Define the folder where files should be uploaded
          String recipeImage = file.getOriginalFilename();

          File uploadDir = new File(folder);
          if (!uploadDir.exists()) {
               uploadDir.mkdirs();  // Create directory if it does not exist
          }

          try {
               file.transferTo(Paths.get(folder + recipeImage));
          } catch (IOException e) {
               e.printStackTrace();
               return "Error updating recipe image";
          }

          return recipeImage;
     }
}
