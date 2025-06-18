package backend.service.impl;

import backend.model.Recipe;
import backend.model.Comment;
import backend.model.RecipeLike;
import backend.DTO.RecipeRequest;
import backend.repository.RecipeRepository;
import backend.repository.CommentRepository;
import backend.repository.RecipeLikeRepository;
import backend.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class RecipeServiceImpl implements RecipeService {
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private RecipeLikeRepository likeRepository;

    @Override
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @Override
    public Optional<Recipe> getRecipeById(String id) {
        if (id == null) return Optional.empty();
        return recipeRepository.findById(id);
    }

    @Override
    public Recipe createRecipe(RecipeRequest recipeRequest) {
        Recipe recipe = new Recipe();
        recipe.setTitle(recipeRequest.getTitle());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setIngredients(recipeRequest.getIngredients());
        recipe.setInstructions(recipeRequest.getInstructions());
        recipe.setOwner(recipeRequest.getOwner());
        recipe.setCommentIds(new ArrayList<>());
        recipe.setLikeIds(new ArrayList<>());
        return recipeRepository.save(recipe);
    }

    @Override
    public Optional<Recipe> updateRecipe(String id, RecipeRequest recipeRequest) {
        if (id == null) return Optional.empty();
        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (optionalRecipe.isPresent()) {
            Recipe recipe = optionalRecipe.get();
            recipe.setTitle(recipeRequest.getTitle());
            recipe.setDescription(recipeRequest.getDescription());
            recipe.setIngredients(recipeRequest.getIngredients());
            recipe.setInstructions(recipeRequest.getInstructions());
            recipe.setOwner(recipeRequest.getOwner());
            return Optional.of(recipeRepository.save(recipe));
        }
        return Optional.empty();
    }

    @Override
    public boolean deleteRecipe(String id) {
        if (id == null) return false;
        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        if (optionalRecipe.isPresent()) {
            recipeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Comment> getCommentsByRecipeId(String recipeId) {
        if (recipeId == null) return List.of();
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
        if (recipeOpt.isEmpty()) return List.of();
        Recipe recipe = recipeOpt.get();
        List<String> commentIds = recipe.getCommentIds();
        if (commentIds == null) return List.of();
        List<Comment> comments = new ArrayList<>();
        for (String commentId : commentIds) {
            commentRepository.findById(commentId).ifPresent(comments::add);
        }
        return comments;
    }

    @Override
    public Comment addComment(String recipeId, Comment comment) {
        if (recipeId == null) throw new IllegalArgumentException("Recipe ID cannot be null");
        Optional<Recipe> recipeOpt = recipeRepository.findById(recipeId);
        if (recipeOpt.isEmpty()) throw new IllegalArgumentException("Recipe not found");
        Recipe recipe = recipeOpt.get();
        comment.setRecipeId(recipeId);
        Comment savedComment = commentRepository.save(comment);
        List<String> commentIds = recipe.getCommentIds();
        if (commentIds == null) commentIds = new ArrayList<>();
        commentIds.add(savedComment.getId());
        recipe.setCommentIds(commentIds);
        recipeRepository.save(recipe);
        return savedComment;
    }
} 