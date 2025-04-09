import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 181, 67, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(74, 181, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 181, 67, 0); }
`;

const Container = styled(motion.div)`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 2.2rem;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  margin: 8px 0;
  border-radius: 10px;
  border: 1px solid #dfe6e9;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  margin: 8px 0;
  border-radius: 10px;
  border: 1px solid #dfe6e9;
  font-size: 16px;
  min-height: 120px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  resize: vertical;
  
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #2ecc71, #3498db);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ImagePreview = styled(motion.div)`
  width: 180px;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 2px dashed #dfe6e9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  padding: 1rem;
  margin-top: 1.5rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
`;

const FileInputContainer = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px dashed #bdc3c7;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: #7f8c8d;
  
  &:hover {
    background: #ecf0f1;
    border-color: #3498db;
    color: #3498db;
  }
`;

const FileInput = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const LoadingIndicator = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

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
      
      const recipeData = {
        recipeId: inventory.recipeId,
        recipeName: inventory.recipeName,
        recipeCategory: inventory.recipeCategory,
        recipeQty: parseInt(inventory.recipeQty, 10),
        recipeDetails: inventory.recipeDetails,
        recipePrice: parseFloat(inventory.recipePrice)
      };

      formData.append('recipeDetails', JSON.stringify(recipeData));
      
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

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Update Recipe</Title>

      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </ErrorMessage>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Recipe ID</Label>
          <Input 
            type="text" 
            name="recipeId" 
            value={inventory.recipeId} 
            onChange={handleChange} 
            required 
            readOnly
          />
        </FormGroup>

        <FormGroup>
          <Label>Recipe Image</Label>
          <FileInputContainer>
            <FileInputLabel>
              {newImage ? 'Change Image' : 'Choose New Image'}
              <FileInput 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
              />
            </FileInputLabel>
          </FileInputContainer>
          
          {(newImage || currentImage) && (
            <ImagePreview
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={newImage ? URL.createObjectURL(newImage) : `http://localhost:8080/api/uploads/${currentImage}`} 
                alt="Preview" 
              />
            </ImagePreview>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Recipe Name</Label>
          <Input 
            type="text" 
            name="recipeName" 
            value={inventory.recipeName} 
            onChange={handleChange} 
            required 
          />
        </FormGroup>

        <FormGroup>
          <Label>Recipe Category</Label>
          <Input 
            type="text" 
            name="recipeCategory" 
            value={inventory.recipeCategory} 
            onChange={handleChange} 
            required 
          />
        </FormGroup>

        <FormGroup>
          <Label>Quantity</Label>
          <Input 
            type="number" 
            name="recipeQty" 
            value={inventory.recipeQty} 
            onChange={handleChange} 
            required 
            min="1"
          />
        </FormGroup>

        <FormGroup>
          <Label>Details</Label>
          <TextArea 
            name="recipeDetails" 
            value={inventory.recipeDetails} 
            onChange={handleChange} 
            required 
          />
        </FormGroup>

        <FormGroup>
          <Label>Price (LKR)</Label>
          <Input 
            type="number" 
            name="recipePrice" 
            value={inventory.recipePrice} 
            onChange={handleChange} 
            required 
            min="0"
            step="0.01"
          />
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <LoadingIndicator /> Updating...
            </>
          ) : (
            'Update Recipe'
          )}
        </SubmitButton>

        {submitSuccess && (
          <SuccessMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Recipe updated successfully! Redirecting...
          </SuccessMessage>
        )}
      </form>
    </Container>
  );
}

export default Updaterecipe;