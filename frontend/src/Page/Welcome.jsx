import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaPlus, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { GiCookingPot } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../api/axiosConfig";
import Navbar from './Navbar';
import './RecipeDisplay.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Enhanced Welcome Component
const Welcome = () => {
  return (
    <motion.div 
      className="welcome-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="welcome-title">Welcome to FlavorFusion</h1>
      <p className="welcome-subtitle">Discover, Create, and Share Amazing Recipes</p>
      <motion.div 
        className="welcome-scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ↓ Scroll to explore ↓
      </motion.div>
    </motion.div>
  );
};

// Image Component with Loading State
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`image-container ${loading ? 'loading' : ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc('/images/default-recipe.jpg');
          setLoading(false);
        }}
      />
      {loading && <div className="image-loading-spinner"></div>}
    </div>
  );
};

// Main RecipeDisplay Component
function RecipeDisplay() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedRecipes, setLikedRecipes] = useState(() => {
    const saved = localStorage.getItem('likedRecipes');
    return saved ? JSON.parse(saved) : {};
  });
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('recipeComments');
    return saved ? JSON.parse(saved) : {};
  });
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/check');
        setIsLoggedIn(response.data.authenticated);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Save liked recipes and comments to localStorage
  useEffect(() => {
    localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes));
    localStorage.setItem('recipeComments', JSON.stringify(comments));
  }, [likedRecipes, comments]);

  // Load recipes from API
  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/inventory");
      setRecipes(response.data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete recipe
  const handleDelete = async (recipeId) => {
    try {
      await api.delete(`/api/inventory/${recipeId}`);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // Like/unlike recipe
  const handleLike = (recipeId) => {
    setLikedRecipes(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  // Toggle comment box
  const toggleCommentBox = (recipeId) => {
    setShowCommentBox(prev => prev === recipeId ? null : recipeId);
  };

  // Add comment
  const handleAddComment = (recipeId) => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [recipeId]: [...(prev[recipeId] || []), {
          id: Date.now(),
          text: newComment,
          date: new Date().toISOString(),
          replies: []
        }]
      }));
      setNewComment('');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Load recipes on component mount
  useEffect(() => {
    loadRecipes();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(recipes.map(recipe => recipe.category))];

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = (recipe.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (recipe.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="recipe-app-container">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <Welcome />
      
      <div className="recipe-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
            const recipeComments = comments[recipe.id] || [];
            
            return (
              <motion.div 
                key={recipe.id} 
                className="recipe-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="recipe-image-container">
                  {recipe.imageUrl ? (
                    <ImageWithFallback
                      src={`${API_BASE_URL}/uploads/${recipe.imageUrl.startsWith('/uploads/') ? recipe.imageUrl.substring('/uploads/'.length) : recipe.imageUrl}`}
                      alt={recipe.name}
                      className="recipe-image"
                    />
                  ) : (
                    <div className="recipe-image-placeholder">
                      <span>No Image Available</span>
                    </div>
                  )}
                  <span className="recipe-category">{recipe.category}</span>
                  
                  {isLoggedIn && (
                    <div className="recipe-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => setShowDeleteConfirm(recipe.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="recipe-details">{recipe.description}</p>
                  
                  <div className="recipe-meta">
                    <span className="recipe-price">LKR {recipe.price}</span>
                    <span className="recipe-quantity">{recipe.quantity} servings</span>
                  </div>
                  
                  <div className="recipe-social">
                    <motion.button 
                      className={`social-btn like-btn ${likedRecipes[recipe.id] ? 'liked' : ''}`}
                      onClick={() => handleLike(recipe.id)}
                      whileTap={{ scale: 0.9 }}
                    >
                      {likedRecipes[recipe.id] ? <FaHeart /> : <FaRegHeart />}
                      <span>{likedRecipes[recipe.id] ? 'Liked' : 'Like'}</span>
                    </motion.button>
                    
                    <motion.button 
                      className="social-btn comment-btn"
                      onClick={() => toggleCommentBox(recipe.id)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaComment />
                      <span>Comment ({recipeComments.length})</span>
                    </motion.button>
                  </div>
                  
                  {showCommentBox === recipe.id && (
                    <motion.div 
                      className="comment-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="comment-list">
                        {recipeComments.length > 0 ? (
                          recipeComments.map(comment => (
                            <div key={comment.id} className="comment">
                              <p>{comment.text}</p>
                              <small>{new Date(comment.date).toLocaleString()}</small>
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
                        <button onClick={() => handleAddComment(recipe.id)}>Post</button>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.button 
                    className="view-recipe-btn"
                    onClick={() => navigate(`/recipedetails/${recipe.id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Recipe
                  </motion.button>
                </div>
                
                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                  {showDeleteConfirm === recipe.id && (
                    <motion.div 
                      className="delete-confirm-modal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="modal-content">
                        <p>Are you sure you want to delete this recipe?</p>
                        <div className="modal-buttons">
                          <button 
                            className="confirm-btn"
                            onClick={() => handleDelete(recipe.id)}
                          >
                            Yes, Delete
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={() => setShowDeleteConfirm(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipeDisplay;