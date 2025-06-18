package backend.service;

import backend.model.Recipe;
import backend.model.Comment;
import backend.DTO.RecipeRequest;

import java.util.List;
import java.util.Optional;

public interface RecipeService {
    List<Recipe> getAllRecipes();
    Optional<Recipe> getRecipeById(String id);
    Recipe createRecipe(RecipeRequest recipeRequest);
    Optional<Recipe> updateRecipe(String id, RecipeRequest recipeRequest);
    boolean deleteRecipe(String id);
    List<Comment> getCommentsByRecipeId(String recipeId);
    Comment addComment(String recipeId, Comment comment);
} 