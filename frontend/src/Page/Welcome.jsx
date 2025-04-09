import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeart, FaRegHeart, FaComment, FaShare, FaStar, FaRegStar, 
  FaWhatsapp, FaFacebook, FaTwitter, FaLink, FaReply, FaEdit, 
  FaTrash, FaThumbsUp, FaRegThumbsUp, FaLaughSquint 
} from 'react-icons/fa';
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
    const saved = localStorage.getItem('likedRecipes');
    return saved ? JSON.parse(saved) : {};
  });
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('recipeComments');
    return saved ? JSON.parse(saved) : {};
  });
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [userRatings, setUserRatings] = useState(() => {
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
    setLikedRecipes(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  const toggleCommentBox = (recipeId) => {
    setShowCommentBox(prev => prev === recipeId ? null : recipeId);
    setShowShareOptions(null);
    setReplyingTo(null);
    setEditingComment(null);
  };

  const handleAddComment = (recipeId) => {
    if (!newComment.trim()) return;
    
    const commentData = {
      id: Date.now(),
      text: newComment,
      author: 'You',
      timestamp: new Date().toLocaleString(),
      likes: 0,
      reactions: {},
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [recipeId]: [...(prev[recipeId] || []), commentData]
    }));
    setNewComment('');
  };

  const handleAddReply = (recipeId, commentId) => {
    if (!replyText.trim()) return;
    
    const replyData = {
      id: Date.now(),
      text: replyText,
      author: 'You',
      timestamp: new Date().toLocaleString(),
      likes: 0,
      reactions: {}
    };

    setComments(prev => {
      const updatedComments = (prev[recipeId] || []).map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, replyData]
          };
        }
        return comment;
      });
      return { ...prev, [recipeId]: updatedComments };
    });
    
    setReplyText('');
    setReplyingTo(null);
  };

  const startEditingComment = (comment) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.text);
    setReplyingTo(null);
  };

  const saveEditedComment = (recipeId, commentId) => {
    if (!editCommentText.trim()) return;
    
    setComments(prev => {
      const updatedComments = (prev[recipeId] || []).map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            text: editCommentText
          };
        }
        return comment;
      });
      return { ...prev, [recipeId]: updatedComments };
    });
    
    setEditingComment(null);
    setEditCommentText('');
  };

  const deleteComment = (recipeId, commentId, isReply = false, parentCommentId = null) => {
    if (isReply && parentCommentId) {
      // Delete a reply
      setComments(prev => {
        const updatedComments = (prev[recipeId] || []).map(comment => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            };
          }
          return comment;
        });
        return { ...prev, [recipeId]: updatedComments };
      });
    } else {
      // Delete a main comment
      setComments(prev => ({
        ...prev,
        [recipeId]: (prev[recipeId] || []).filter(comment => comment.id !== commentId)
      }));
    }
  };

  const toggleLikeComment = (recipeId, commentId, isReply = false, parentCommentId = null) => {
    setComments(prev => {
      if (isReply && parentCommentId) {
        const updatedComments = (prev[recipeId] || []).map(comment => {
          if (comment.id === parentCommentId) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.likes + (reply.reactions?.like ? -1 : 1),
                  reactions: {
                    ...reply.reactions,
                    like: !reply.reactions?.like
                  }
                };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        return { ...prev, [recipeId]: updatedComments };
      } else {
        const updatedComments = (prev[recipeId] || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.likes + (comment.reactions?.like ? -1 : 1),
              reactions: {
                ...comment.reactions,
                like: !comment.reactions?.like
              }
            };
          }
          return comment;
        });
        return { ...prev, [recipeId]: updatedComments };
      }
    });
  };

  const addReaction = (recipeId, commentId, reactionType, isReply = false, parentCommentId = null) => {
    setComments(prev => {
      if (isReply && parentCommentId) {
        const updatedComments = (prev[recipeId] || []).map(comment => {
          if (comment.id === parentCommentId) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                // If the same reaction is clicked, remove it
                const currentReaction = reply.reactions?.type === reactionType ? null : reactionType;
                return {
                  ...reply,
                  reactions: {
                    ...reply.reactions,
                    type: currentReaction
                  }
                };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        return { ...prev, [recipeId]: updatedComments };
      } else {
        const updatedComments = (prev[recipeId] || []).map(comment => {
          if (comment.id === commentId) {
            // If the same reaction is clicked, remove it
            const currentReaction = comment.reactions?.type === reactionType ? null : reactionType;
            return {
              ...comment,
              reactions: {
                ...comment.reactions,
                type: currentReaction
              }
            };
          }
          return comment;
        });
        return { ...prev, [recipeId]: updatedComments };
      }
    });
  };

  const handleRating = (recipeId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [recipeId]: rating
    }));
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

  const renderComment = (comment, recipeId, isReply = false, parentCommentId = null) => {
    return (
      <div key={comment.id} className={`comment ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <strong>{comment.author}</strong>
          <span className="comment-time">{comment.timestamp}</span>
        </div>
        
        {editingComment === comment.id ? (
          <div className="comment-edit">
            <input
              type="text"
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              autoFocus
            />
            <button onClick={() => saveEditedComment(recipeId, comment.id)}>Save</button>
            <button onClick={() => setEditingComment(null)}>Cancel</button>
          </div>
        ) : (
          <div className="comment-text">{comment.text}</div>
        )}
        
        <div className="comment-actions">
          <button 
            className={`action-btn like-btn ${comment.reactions?.like ? 'active' : ''}`}
            onClick={() => toggleLikeComment(recipeId, comment.id, isReply, parentCommentId)}
          >
            {comment.reactions?.like ? <FaThumbsUp /> : <FaRegThumbsUp />}
            <span>{comment.likes || 0}</span>
          </button>
          
          <div className="reaction-buttons">
            <button 
              className={`reaction-btn ${comment.reactions?.type === 'heart' ? 'active' : ''}`}
              onClick={() => addReaction(recipeId, comment.id, 'heart', isReply, parentCommentId)}
              title="Heart"
            >
              <FaHeart />
            </button>
            <button 
              className={`reaction-btn ${comment.reactions?.type === 'wow' ? 'active' : ''}`}
              onClick={() => addReaction(recipeId, comment.id, 'wow', isReply, parentCommentId)}
              title="Wow"
            >
              <FaLaughSquint />
            </button>
          </div>
          
          {!isReply && (
            <button 
              className="action-btn reply-btn"
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                setEditingComment(null);
              }}
            >
              <FaReply /> Reply
            </button>
          )}
          
          {comment.author === 'You' && (
            <>
              <button 
                className="action-btn edit-btn"
                onClick={() => startEditingComment(comment)}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => deleteComment(recipeId, comment.id, isReply, parentCommentId)}
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
        
        {replyingTo === comment.id && (
          <div className="reply-input">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={() => handleAddReply(recipeId, comment.id)}>Post</button>
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-container">
            {comment.replies.map(reply => renderComment(reply, recipeId, true, comment.id))}
          </div>
        )}
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
                          recipeComments.map(comment => renderComment(comment, recipe.recipeId))
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