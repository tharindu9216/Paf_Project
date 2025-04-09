package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class InventoryModel {

    @Id
    @GeneratedValue
    private UUID id;

    private String recipeId;
    private String recipeImage;
    private String recipeName;
    private String recipeCategory;
    private String recipeQty;
    private String recipeDetails;
    private String recipePrice;

    public InventoryModel() {
    }

    public InventoryModel(UUID id, String recipeId, String recipeImage, String recipeName,
                          String recipeCategory, String recipeQty, String recipeDetails, String recipePrice) {
        this.id = id;
        this.recipeId = recipeId;
        this.recipeImage = recipeImage;
        this.recipeName = recipeName;
        this.recipeCategory = recipeCategory;
        this.recipeQty = recipeQty;
        this.recipeDetails = recipeDetails;
        this.recipePrice = recipePrice;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(String recipeId) {
        this.recipeId = recipeId;
    }

    public String getRecipeImage() {
        return recipeImage;
    }

    public void setRecipeImage(String recipeImage) {
        this.recipeImage = recipeImage;
    }

    public String getRecipeName() {
        return recipeName;
    }

    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    public String getRecipeCategory() {
        return recipeCategory;
    }

    public void setRecipeCategory(String recipeCategory) {
        this.recipeCategory = recipeCategory;
    }

    public String getRecipeQty() {
        return recipeQty;
    }

    public void setRecipeQty(String recipeQty) {
        this.recipeQty = recipeQty;
    }

    public String getRecipeDetails() {
        return recipeDetails;
    }

    public void setRecipeDetails(String recipeDetails) {
        this.recipeDetails = recipeDetails;
    }

    public String getRecipePrice() {
        return recipePrice;
    }

    public void setRecipePrice(String recipePrice) {
        this.recipePrice = recipePrice;
    }
}
