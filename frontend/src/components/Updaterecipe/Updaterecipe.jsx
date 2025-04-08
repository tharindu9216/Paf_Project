import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Updaterecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState({
    recipeId: '',
    recipeName: '',
    recipeCategory: '',
    recipeQty: '',
    recipeDetails: '',
    recipePrice: ''
  });

  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/inventory/${id}`);
        const { recipeImage, ...recipeData } = response.data;
        setInventory({
          ...recipeData,
          recipeQty: recipeData.recipeQty.toString(),
          recipePrice: recipeData.recipePrice.toString()
        });
        setCurrentImage(recipeImage);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError("Failed to load recipe details. Please try again later.");
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Prepare the recipe data object exactly as the backend expects
      const recipeData = {
        recipeId: inventory.recipeId,
        recipeName: inventory.recipeName,
        recipeCategory: inventory.recipeCategory,
        recipeQty: parseInt(inventory.recipeQty, 10),
        recipeDetails: inventory.recipeDetails,
        recipePrice: parseFloat(inventory.recipePrice)
      };

      // Append the recipe data as JSON string with the exact field name the backend expects
      formData.append('recipeDetails', JSON.stringify(recipeData));
      
      // Append the file with the exact field name the backend expects
      if (newImage) {
        formData.append('file', newImage);
      }

      const response = await axios.put(
        `http://localhost:8080/api/inventory/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setSubmitSuccess(true);
        setTimeout(() => navigate('/inventory'), 2000);
      }
    } catch (error) {
      let errorMessage = 'Error updating recipe';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data || 'Invalid data submitted';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      setError(errorMessage);
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles (keep your existing styles)
  const containerStyle = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Recipe</h1>

      {error && (
        <div style={{ 
          color: '#721c24',
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          border: '1px solid transparent'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Recipe ID</label>
          <input 
            type="text" 
            name="recipeId" 
            value={inventory.recipeId} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
            readOnly
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Recipe Image</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            style={inputStyle} 
            accept="image/*" 
          />
          <div style={{ marginTop: '10px' }}>
            {newImage ? (
              <img 
                src={URL.createObjectURL(newImage)} 
                alt="Preview" 
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
              />
            ) : currentImage && (
              <img 
                src={`http://localhost:8080/api/uploads/${currentImage}`} 
                alt="Current" 
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
              />
            )}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Recipe Name</label>
          <input 
            type="text" 
            name="recipeName" 
            value={inventory.recipeName} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Recipe Category</label>
          <input 
            type="text" 
            name="recipeCategory" 
            value={inventory.recipeCategory} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Quantity</label>
          <input 
            type="number" 
            name="recipeQty" 
            value={inventory.recipeQty} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Details</label>
          <textarea 
            name="recipeDetails" 
            value={inventory.recipeDetails} 
            onChange={handleChange} 
            style={{ ...inputStyle, minHeight: '100px' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Price (LKR)</label>
          <input 
            type="number" 
            name="recipePrice" 
            value={inventory.recipePrice} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: isSubmitting ? '#ccc' : '#4CAF50',
            color: 'white',
            padding: '14px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Recipe'}
        </button>

        {submitSuccess && (
          <div style={{ 
            color: '#155724',
            backgroundColor: '#d4edda',
            borderColor: '#c3e6cb',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '4px',
            border: '1px solid transparent'
          }}>
            Recipe updated successfully! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
}

export default Updaterecipe;