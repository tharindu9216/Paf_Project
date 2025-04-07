import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Addrecipe() {
  const [inventory, setinventory] = useState({
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

  const navigate = useNavigate();

  const {
    recipeId,
    recipeImage,
    recipeName,
    recipeCategory,
    recipeQty,
    recipeDetails,
    recipePrice
  } = inventory;

  const handleChange = (e) => {
    setinventory({ ...inventory, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setinventory({ ...inventory, recipeImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', recipeImage);
    let imageName = '';

    try {
      const response = await axios.post(
        'http://localhost:8080/inventory/recipeImage/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      imageName = response.data;  // This should return the image filename
    } catch (error) {
      alert(`Error uploading image: ${error.response ? error.response.data : error.message}`);
      setIsSubmitting(false);
      return;
    }

    const updateInventory = { ...inventory, recipeImage: imageName };

    try {
      await axios.post('http://localhost:8080/inventory', updateInventory);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      window.location.reload();
    } catch (error) {
      alert(`Error adding recipe: ${error.response ? error.response.data : error.message}`);
    }

    setIsSubmitting(false);
  };

  // Animation styles
  const pulseAnimation = {
    animation: 'pulse 2s infinite'
  };

  const fadeIn = {
    animation: 'fadeIn 0.5s ease-in'
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    ...fadeIn
  };

  const headingStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem',
    fontSize: '2.2rem',
    fontWeight: '600',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    position: 'relative',
    paddingBottom: '10px'
  };

  const headingUnderline = {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #e74c3c, #f39c12)',
    borderRadius: '2px'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem',
    position: 'relative'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: '500',
    fontSize: '1rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const fileInputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    background: '#fff',
    border: '1px dashed #3498db',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const imagePreviewStyle = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '10px',
    border: '2px solid #fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(90deg, #e74c3c, #f39c12)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    ...pulseAnimation
  };

  const successMessageStyle = {
    marginTop: '1.5rem',
    padding: '15px',
    background: '#2ecc71',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '500',
    ...fadeIn
  };

  const loadingStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>
        Add New Recipe
        <span style={headingUnderline}></span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Recipe ID</label>
          <input
            type="text"
            name="recipeId"
            value={recipeId}
            onChange={handleChange}
            style={inputStyle}
            required
            placeholder="Enter recipe ID"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Recipe Image</label>
          <input
            type="file"
            id="recipeImage"
            name="recipeImage"
            accept="image/*"
            onChange={handleFileChange}
            style={fileInputStyle}
            required
          />
          {recipeImage && (
            <img
              src={URL.createObjectURL(recipeImage)}
              alt="Preview"
              style={imagePreviewStyle}
            />
          )}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Recipe Name</label>
          <input
            type="text"
            name="recipeName"
            value={recipeName}
            onChange={handleChange}
            style={inputStyle}
            required
            placeholder="Enter recipe name"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Category</label>
          <input
            type="text"
            name="recipeCategory"
            value={recipeCategory}
            onChange={handleChange}
            style={inputStyle}
            required
            placeholder="Enter category"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Quantity</label>
          <input
            type="text"
            name="recipeQty"
            value={recipeQty}
            onChange={handleChange}
            style={inputStyle}
            required
            placeholder="Enter quantity"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Details</label>
          <textarea
            name="recipeDetails"
            value={recipeDetails}
            onChange={handleChange}
            style={textareaStyle}
            required
            placeholder="Enter recipe details"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Price</label>
          <input
            type="text"
            name="recipePrice"
            value={recipePrice}
            onChange={handleChange}
            style={inputStyle}
            required
            placeholder="Enter price"
          />
        </div>

        <button
          type="submit"
          style={submitButtonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={loadingStyle}></span>
              <span style={{ marginLeft: '10px' }}>Adding...</span>
            </span>
          ) : (
            'Add Recipe'
          )}
        </button>

        {submitSuccess && (
          <div style={successMessageStyle}>
            Recipe added successfully! 🎉
          </div>
        )}
      </form>
    </div>
  );
}

export default Addrecipe;
