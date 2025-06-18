package backend.DTO;  // Must match the actual directory name (uppercase DTO)

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class InventoryRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @NotNull
    @Positive
    private Double price;

    @NotBlank
    private String description;

    private String imageUrl;
}