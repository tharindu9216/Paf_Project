package backend.controller;

import backend.model.Recipe;
import backend.model.Comment;
import backend.DTO.RecipeRequest;
import backend.DTO.ErrorResponse;
import backend.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    @Autowired
    private RecipeService recipeService;

    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable String id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Recipe ID cannot be null"));
        }
        Optional<Recipe> recipe = recipeService.getRecipeById(id);
        if (recipe.isPresent()) {
            return ResponseEntity.ok(recipe.get());
        } else {
            return ResponseEntity.status(404).body(new ErrorResponse("Recipe not found"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody RecipeRequest recipeRequest) {
        try {
            Recipe created = recipeService.createRecipe(recipeRequest);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable String id, @RequestBody RecipeRequest recipeRequest) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Recipe ID cannot be null"));
        }
        try {
            Optional<Recipe> updated = recipeService.updateRecipe(id, recipeRequest);
            if (updated.isPresent()) {
                return ResponseEntity.ok(updated.get());
            } else {
                return ResponseEntity.status(404).body(new ErrorResponse("Recipe not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable String id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Recipe ID cannot be null"));
        }
        try {
            boolean deleted = recipeService.deleteRecipe(id);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(404).body(new ErrorResponse("Recipe not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Comments endpoints
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable String id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Recipe ID cannot be null"));
        }
        List<Comment> comments = recipeService.getCommentsByRecipeId(id);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id, @RequestBody Comment comment) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Recipe ID cannot be null"));
        }
        try {
            Comment created = recipeService.addComment(id, comment);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Exception handler for invalid path variables
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse("Invalid ID format"));
    }
} 