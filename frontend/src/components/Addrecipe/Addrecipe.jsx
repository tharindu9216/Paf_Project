import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Addrecipe() {
  const [inventory, setInventory] = useState({
    recipeId: '',
    recipeImage: null,
    recipeName: '',
    recipeCategory: '',
    recipeQty: '',
    recipeDetails: '',
    recipePrice: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInventory({ ...inventory, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setInventory({ ...inventory, recipeImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', inventory.recipeImage);

      const uploadResponse = await axios.post(
        'http://localhost:8080/api/inventory/recipeImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const recipeData = {
        ...inventory,
        recipeImage: uploadResponse.data // server returns just the filename
      };

      await axios.post('http://localhost:8080/api/inventory', recipeData);

      setSubmitSuccess(true);
      setTimeout(() => navigate('/recipes'), 2000);

    } catch (error) {
      let errorMessage = 'Operation failed';
      if (error.response) {
        errorMessage = error.response.data || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server - check if backend is running';
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.error('Full error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    border: '1px solid #ddd'
  };

  return (
    <div style={containerStyle}>
      <h1>Add New Recipe</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe ID</label>
          <input type="text" name="recipeId" value={inventory.recipeId} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label>Recipe Image</label>
          <input type="file" name="recipeImage" onChange={handleFileChange} style={inputStyle} accept="image/*" required />
          {inventory.recipeImage && (
            <img src={URL.createObjectURL(inventory.recipeImage)} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />
          )}
        </div>

        <div>
          <label>Recipe Name</label>
          <input type="text" name="recipeName" value={inventory.recipeName} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label>Recipe Category</label>
          <input type="text" name="recipeCategory" value={inventory.recipeCategory} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label>Quantity</label>
          <input type="number" name="recipeQty" value={inventory.recipeQty} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label>Details</label>
          <textarea name="recipeDetails" value={inventory.recipeDetails} onChange={handleChange} style={inputStyle} required />
        </div>

        <div>
          <label>Price (LKR)</label>
          <input type="number" name="recipePrice" value={inventory.recipePrice} onChange={handleChange} style={inputStyle} required />
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
            cursor: 'pointer'
          }}
        >
          {isSubmitting ? 'Processing...' : 'Add Recipe'}
        </button>

        {submitSuccess && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            Recipe added successfully! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
}

export default Addrecipe;
