package backend.DTO;

public class RecipeRequest {
    private String title;
    private String description;
    private String ingredients;
    private String instructions;
    private String owner;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
} 