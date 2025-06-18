package backend.repository;

import backend.model.RecipeLike;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeLikeRepository extends MongoRepository<RecipeLike, String> {
}

 