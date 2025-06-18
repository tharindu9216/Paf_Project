package backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import backend.model.Recipe;
import backend.repository.RecipeRepository;
import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private UserRepository userRepository;

    // Get user profile
    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Update user profile
    @PutMapping("/{username}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String username, @RequestBody User updated) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        User user = userOpt.get();
        user.setBio(updated.getBio());
        user.setPhone(updated.getPhone());
        user.setAddress(updated.getAddress());
        user.setSocialLinks(updated.getSocialLinks());
        user.setAvatarUrl(updated.getAvatarUrl());
        user.setCoverUrl(updated.getCoverUrl());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    // Upload avatar
    @PostMapping("/{username}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable String username, @RequestParam("file") MultipartFile file) {
        // TODO: Implement file storage and set avatarUrl
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Avatar upload not implemented");
    }

    // Upload cover photo
    @PostMapping("/{username}/cover")
    public ResponseEntity<?> uploadCover(@PathVariable String username, @RequestParam("file") MultipartFile file) {
        // TODO: Implement file storage and set coverUrl
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Cover upload not implemented");
    }

    // Get user stats
    @GetMapping("/{username}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable String username) {
        // TODO: Implement stats (e.g., post count, followers, etc.)
        return ResponseEntity.ok(new Object() {
            public int posts = 0;
            public int followers = 0;
            public int following = 0;
        });
    }

    // Get user activity feed
    @GetMapping("/{username}/activity")
    public ResponseEntity<?> getUserActivity(@PathVariable String username) {
        // TODO: Implement activity feed
        return ResponseEntity.ok(new Object[]{});
    }

    // Change password
    @PutMapping("/{username}/password")
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody String newPassword) {
        // TODO: Implement password change
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Change password not implemented");
    }

    // Update settings
    @PutMapping("/{username}/settings")
    public ResponseEntity<?> updateSettings(@PathVariable String username, @RequestBody String settings) {
        // TODO: Implement settings update
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Settings update not implemented");
    }

    // Delete/deactivate account
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteAccount(@PathVariable String username) {
        // TODO: Implement account deletion
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Delete account not implemented");
    }

    @GetMapping("/{username}/recipes")
    public ResponseEntity<?> getUserRecipes(@PathVariable String username) {
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("Username cannot be null or empty");
        }
        List<Recipe> recipes = recipeRepository.findAll().stream()
                .filter(r -> username.equals(r.getOwner()))
                .toList();
        return ResponseEntity.ok(recipes);
    }

    // Add more user-related endpoints as needed
} 