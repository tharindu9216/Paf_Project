import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Updaterecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventory, setInventory] = useState({
    recipeId: '',
    recipeImage: '',
    recipeName: '',
    recipeCategory: '',
    recipeQty: '',
    recipeDetails: '',
    recipePrice: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/inventory/${id}`)
      .then(res => {
        setInventory(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load recipe details");
      });
  }, [id]);

  const handleChange = (e) => {
    setInventory({ ...inventory, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('recipeDetails', JSON.stringify({
        recipeId: inventory.recipeId,
        recipeName: inventory.recipeName,
        recipeCategory: inventory.recipeCategory,
        recipeQty: inventory.recipeQty,
        recipeDetails: inventory.recipeDetails,
        recipePrice: inventory.recipePrice
      }));
      
      if (image) {
        formData.append('file', image);
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
      if (error.response && error.response.status === 404) {
        setError(`Recipe with ID ${id} not found. Please check the ID.`);
      } else {
        setError('Error updating recipe: ' + (error.response?.data || error.message));
      }
      console.error('Update error:', error);
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
      <h1>Update Recipe</h1>

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
          <input type="file" name="recipeImage" onChange={handleFileChange} style={inputStyle} accept="image/*" />
          {image ? (
            <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />
          ) : inventory.recipeImage && (
            <img src={`http://localhost:8080/api/uploads/${inventory.recipeImage}`} alt="Existing" style={{ width: '100px', marginTop: '10px' }} />
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
            background: isSubmitting ? '#ccc' : '#2196F3',
            color: 'white',
            padding: '14px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Recipe'}
        </button>

        {submitSuccess && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            Recipe updated successfully! Redirecting...
          </div>
        )}
      </form>
    </div>
  );
}

export default Updaterecipe;