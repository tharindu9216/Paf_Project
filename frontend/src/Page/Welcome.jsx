import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaStar, FaRegStar, FaWhatsapp, FaFacebook, FaTwitter, FaLink } from 'react-icons/fa';
import './RecipeDisplay.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to FlavorFusion</h1>
      <p className="welcome-subtitle">Discover, Create, and Share Amazing Recipes</p>
    </div>
  );
}

function RecipeDisplay() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedRecipes, setLikedRecipes] = useState(() => {
    // Load liked recipes from localStorage
    const saved = localStorage.getItem('likedRecipes');
    return saved ? JSON.parse(saved) : {};
  });
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [comments, setComments] = useState(() => {
    // Load comments from localStorage
    const saved = localStorage.getItem('recipeComments');
    return saved ? JSON.parse(saved) : {};
  });
  const [newComment, setNewComment] = useState('');
  const [userRatings, setUserRatings] = useState(() => {
    // Load ratings from localStorage
    const saved = localStorage.getItem('userRatings');
    return saved ? JSON.parse(saved) : {};
  });
  const [hoverRating, setHoverRating] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(null);
  const navigate = useNavigate();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
  }, [likedRecipes]);

  useEffect(() => {
    localStorage.setItem('recipeComments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get('http://localhost:8080/api/inventory');
      setRecipes(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setIsLoading(false);
    }
  };

  const handleLike = (recipeId) => {
    setLikedRecipes(prev => {
      const newLikes = {
        ...prev,
        [recipeId]: !prev[recipeId]
      };
      return newLikes;
    });
  };

  const toggleCommentBox = (recipeId) => {
    setShowCommentBox(prev => prev === recipeId ? null : recipeId);
    setShowShareOptions(null);
  };

  const handleAddComment = (recipeId) => {
    if (!newComment.trim()) return;
    
    setComments(prev => {
      const newComments = {
        ...prev,
        [recipeId]: [...(prev[recipeId] || []), {
          id: Date.now(),
          text: newComment,
          author: 'You',
          timestamp: new Date().toLocaleString()
        }]
      };
      return newComments;
    });
    setNewComment('');
  };

  const handleRating = (recipeId, rating) => {
    setUserRatings(prev => {
      const newRatings = {
        ...prev,
        [recipeId]: rating
      };
      return newRatings;
    });
  };

  const toggleShareOptions = (recipeId) => {
    setShowShareOptions(prev => prev === recipeId ? null : recipeId);
    setShowCommentBox(null);
  };

  const shareRecipe = (platform, recipe) => {
    const recipeUrl = `${window.location.origin}/recipedetails/${recipe.recipeId}`;
    const shareText = `Check out this delicious recipe: ${recipe.recipeName} - ${recipeUrl}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(recipeUrl);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  const renderRatingStars = (recipeId) => {
    const currentRating = userRatings[recipeId] || 0;
    const currentHover = hoverRating[recipeId] || 0;
    
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            className={`star ${star <= (currentHover || currentRating) ? 'filled' : ''}`}
            onMouseEnter={() => setHoverRating(prev => ({ ...prev, [recipeId]: star }))}
            onMouseLeave={() => setHoverRating(prev => ({ ...prev, [recipeId]: 0 }))}
            onClick={() => handleRating(recipeId, star)}
          >
            {star <= (currentHover || currentRating) ? <FaStar /> : <FaRegStar />}
          </span>
        ))}
        <span className="rating-text">
          {currentRating ? `You rated this ${currentRating} star${currentRating > 1 ? 's' : ''}` : 'Rate this recipe'}
        </span>
      </div>
    );
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const categories = ['All', ...new Set(recipes.map(recipe => recipe.recipeCategory))];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         recipe.recipeDetails.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.recipeCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="recipe-app-container">
      <Welcome />
      
      <div className="recipe-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading delicious recipes...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="no-results">
          <img src="/images/no-results.svg" alt="No results found" />
          <h3>No recipes found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => {
            const recipeComments = comments[recipe.recipeId] || [];
            
            return (
              <div key={recipe.recipeId} className="recipe-card">
                <div className="recipe-image-container">
                  {recipe.recipeImage && (
                    <img
                      src={`http://localhost:8080/api/uploads/${recipe.recipeImage}`}
                      alt={recipe.recipeName}
                      className="recipe-image"
                    />
                  )}
                  <span className="recipe-category">{recipe.recipeCategory}</span>
                </div>
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.recipeName}</h3>
                  <p className="recipe-details">{recipe.recipeDetails}</p>
                  
                  <div className="user-rating-section">
                    {renderRatingStars(recipe.recipeId)}
                  </div>
                  
                  <div className="recipe-meta">
                    <span className="recipe-price">${recipe.recipePrice}</span>
                    <span className="recipe-quantity">{recipe.recipeQty} servings</span>
                  </div>
                  
                  <div className="recipe-social">
                    <button 
                      className={`social-btn like-btn ${likedRecipes[recipe.recipeId] ? 'liked' : ''}`}
                      onClick={() => handleLike(recipe.recipeId)}
                    >
                      {likedRecipes[recipe.recipeId] ? <FaHeart /> : <FaRegHeart />}
                      <span>{likedRecipes[recipe.recipeId] ? 'Liked' : 'Like'}</span>
                    </button>
                    
                    <button 
                      className="social-btn comment-btn"
                      onClick={() => toggleCommentBox(recipe.recipeId)}
                    >
                      <FaComment />
                      <span>Comment ({recipeComments.length})</span>
                    </button>
                    
                    <div className="share-container">
                      <button 
                        className="social-btn share-btn"
                        onClick={() => toggleShareOptions(recipe.recipeId)}
                      >
                        <FaShare />
                        <span>Share</span>
                      </button>
                      
                      {showShareOptions === recipe.recipeId && (
                        <div className="share-options">
                          <button onClick={() => shareRecipe('whatsapp', recipe)}>
                            <FaWhatsapp /> WhatsApp
                          </button>
                          <button onClick={() => shareRecipe('facebook', recipe)}>
                            <FaFacebook /> Facebook
                          </button>
                          <button onClick={() => shareRecipe('twitter', recipe)}>
                            <FaTwitter /> Twitter
                          </button>
                          <button onClick={() => shareRecipe('copy', recipe)}>
                            <FaLink /> Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {showCommentBox === recipe.recipeId && (
                    <div className="comment-section">
                      <div className="comment-list">
                        {recipeComments.length > 0 ? (
                          recipeComments.map(comment => (
                            <div key={comment.id} className="comment">
                              <strong>{comment.author}</strong>
                              <p>{comment.text}</p>
                              <small>{comment.timestamp}</small>
                            </div>
                          ))
                        ) : (
                          <p className="no-comments">No comments yet. Be the first to comment!</p>
                        )}
                      </div>
                      <div className="comment-input">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={() => handleAddComment(recipe.recipeId)}>Post</button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="view-recipe-btn"
                    onClick={() => navigate(`/recipedetails/${recipe.recipeId}`)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipeDisplay;