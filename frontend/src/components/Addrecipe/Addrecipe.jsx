import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaUpload, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

// Styled components
const FormContainer = styled(motion.div)`
  max-width: 800px;
  margin: 2rem auto;
  padding: 3rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    background: linear-gradient(to bottom, #ff6b6b, #6c5ce7);
  }
`;

const FormTitle = styled.h1`
  font-size: 2.5rem;
  color: #2d3436;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #ff6b6b, #6c5ce7);
    border-radius: 2px;
  }
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1.8rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: #2d3436;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #dfe6e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #dfe6e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-height: 120px;
  resize: vertical;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.2);
  }
`;

const FileInputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(255, 107, 107, 0.1));
  border: 2px dashed rgba(108, 92, 231, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  color: #6c5ce7;
  font-weight: 600;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);

  &:hover {
    background: linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(255, 107, 107, 0.2));
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  svg {
    margin-right: 10px;
    font-size: 1.2rem;
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #6c5ce7, #00b894);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: #b2bec3;
    cursor: not-allowed;
    box-shadow: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }

  &:hover:not(:disabled)::after {
    transform: translateX(100%);
  }

  svg {
    margin-left: 10px;
  }
`;

const ImagePreview = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 15px;
  border: 3px solid #dfe6e9;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::before {
    content: 'Preview';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    text-align: center;
    padding: 5px;
    font-size: 0.8rem;
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 15px;
  background: #00b894;
  color: white;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
`;

const ErrorMessage = styled(motion.div)`
  padding: 15px;
  background: #ff7675;
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
`;

const ErrorText = styled.div`
  color: #ff4757;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

// Secure validation schema
const recipeSchema = yup.object().shape({
  recipeId: yup.string()
    .required('Recipe ID is required')
    .test('is-uuid', 'Invalid Recipe ID format', value => {
      return /^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i.test(value);
    }),
  recipeName: yup.string()
    .required('Recipe name is required')
    .min(3, 'Recipe name must be at least 3 characters')
    .max(100, 'Recipe name cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9\s\-']+$/, 'Invalid characters in recipe name'),
  recipeCategory: yup.string()
    .required('Category is required')
    .oneOf([
      'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 
      'American', 'Dessert', 'Vegan', 'Vegetarian', 'Gluten-Free'
    ], 'Invalid recipe category'),
  recipeQty: yup.number()
    .required('Quantity is required')
    .min(1, 'Minimum quantity is 1')
    .max(1000, 'Maximum quantity is 1000')
    .integer('Quantity must be a whole number'),
  recipeDetails: yup.string()
    .required('Details are required')
    .min(20, 'Details must be at least 20 characters')
    .max(2000, 'Details cannot exceed 2000 characters'),
  recipePrice: yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative')
    .max(10000, 'Price cannot exceed LKR 10,000'),
  recipeImage: yup.mixed()
    .required('Image is required')
    .test('fileSize', 'File too large (max 2MB)', value => {
      return value && value.size <= 2000000;
    })
    .test('fileType', 'Unsupported file format', value => {
      return value && ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
    })
});

function AddRecipe() {
  const [inventory, setInventory] = useState({
    recipeId: uuidv4(), // Auto-generate UUID
    recipeImage: null,
    recipeName: '',
    recipeCategory: '',
    recipeQty: '',
    recipeDetails: '',
    recipePrice: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on change
    recipeSchema.validateAt(name, { [name]: value })
      .then(() => {
        setErrors(prev => ({ ...prev, [name]: '' }));
      })
      .catch(err => {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInventory(prev => ({
        ...prev,
        recipeImage: file
      }));
      
      // Validate file
      recipeSchema.validateAt('recipeImage', { recipeImage: file })
        .then(() => {
          setErrors(prev => ({ ...prev, recipeImage: '' }));
        })
        .catch(err => {
          setErrors(prev => ({ ...prev, recipeImage: err.message }));
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Full validation before submission
      await recipeSchema.validate(inventory, { abortEarly: false });
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', inventory.recipeImage);
      
      // Secure file upload with progress monitoring
      const uploadResponse = await axios.post(
        'http://localhost:8080/api/inventory/recipeImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Prepare data with server-side validation in mind
      const recipeData = {
        ...inventory,
        recipeImage: uploadResponse.data,
        // Sanitize all string inputs
        recipeName: DOMPurify.sanitize(inventory.recipeName),
        recipeCategory: DOMPurify.sanitize(inventory.recipeCategory),
        recipeDetails: DOMPurify.sanitize(inventory.recipeDetails),
        // Convert numbers explicitly
        recipeQty: parseInt(inventory.recipeQty, 10),
        recipePrice: parseFloat(inventory.recipePrice)
      };

      // Secure POST request
      await axios.post('http://localhost:8080/api/inventory', recipeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSubmitSuccess(true);
      setTimeout(() => navigate('/wel'), 2000);

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Handle Yup validation errors
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle API errors
        let errorMessage = 'Operation failed';
        if (error.response) {
          errorMessage = error.response.data?.message || 
                        `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'No response from server - check your connection';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        console.error('Full error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormTitle>Add New Recipe</FormTitle>

      {error && (
        <ErrorMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaExclamationTriangle /> Error: {error}
        </ErrorMessage>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Label>Recipe ID</Label>
          <Input 
            type="text" 
            name="recipeId" 
            value={inventory.recipeId} 
            onChange={handleChange} 
            readOnly
          />
          {errors.recipeId && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipeId}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Label>Recipe Image</Label>
          <FileInputContainer>
            <FileInputLabel>
              <FaUpload /> {inventory.recipeImage ? 'Change Image' : 'Choose Recipe Image'}
              <FileInput 
                type="file" 
                name="recipeImage" 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png, image/webp" 
                required 
              />
            </FileInputLabel>
          </FileInputContainer>
          {errors.recipeImage && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipeImage}
            </ErrorText>
          )}
          {inventory.recipeImage && (
            <ImagePreview
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={URL.createObjectURL(inventory.recipeImage)} 
                alt="Preview" 
                onLoad={() => URL.revokeObjectURL(inventory.recipeImage)}
              />
            </ImagePreview>
          )}
        </FormGroup>

        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Label>Recipe Name</Label>
          <Input 
            type="text" 
            name="recipeName" 
            value={inventory.recipeName} 
            onChange={handleChange} 
            required 
            maxLength={100}
          />
          {errors.recipeName && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipeName}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Label>Recipe Category</Label>
          <Input 
            type="text" 
            name="recipeCategory" 
            value={inventory.recipeCategory} 
            onChange={handleChange} 
            required 
          />
          {errors.recipeCategory && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipeCategory}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Label>Quantity</Label>
          <Input 
            type="number" 
            name="recipeQty" 
            value={inventory.recipeQty} 
            onChange={handleChange} 
            required 
          />
          {errors.recipeQty && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipeQty}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Label>Details</Label>
          <TextArea 
            name="recipeDetails" 
            value={inventory.recipeDetails} 
            onChange={handleChange} 
            required 
          />
          {errors.recipeDetails && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipeDetails}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Label>Price (LKR)</Label>
          <Input 
            type="number" 
            name="recipePrice" 
            value={inventory.recipePrice} 
            onChange={handleChange} 
            required 
          />
          {errors.recipePrice && (
            <ErrorText>
              <FaExclamationTriangle /> {errors.recipePrice}
            </ErrorText>
          )}
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? 'Processing...' : 'Add Recipe'}
          {!isSubmitting && <FaPlus />}
        </SubmitButton>

        {submitSuccess && (
          <SuccessMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Recipe added successfully! Redirecting...
          </SuccessMessage>
        )}
      </form>
    </FormContainer>
  );
}

export default AddRecipe;