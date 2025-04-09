import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h2`
  text-align: center;
  color: #2d3436;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 30px auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const Th = styled.th`
  padding: 16px 20px;
  text-align: left;
  background: linear-gradient(135deg, #ff7675, #e74c3c);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 14px 20px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
  transition: all 0.3s ease;
`;

const Tr = styled(motion.tr)`
  &:hover {
    ${Td} {
      background: #f8f9fa;
    }
  }
`;

const ActionButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 13px;
  margin: 0 5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const DeleteButton = styled(ActionButton)`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  &:hover {
    background: linear-gradient(135deg, #ff6b6b, #e74c3c);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }
`;

const UpdateButton = styled(ActionButton)`
  background: linear-gradient(135deg, #6ab04c, #badc58);
  &:hover {
    background: linear-gradient(135deg, #48b048, #a3dc4f);
    box-shadow: 0 4px 12px rgba(106, 176, 76, 0.3);
  }
`;

const DownloadButton = styled(ActionButton)`
  background: linear-gradient(135deg, #3498db, #2980b9);
  &:hover {
    background: linear-gradient(135deg, #5dade2, #3498db);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }
`;

const ImagePreview = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.8);
    z-index: 10;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function Displayrecipe() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:8080/api/inventory");
      setInventory(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading inventory:", error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const response = await axios.delete(`http://localhost:8080/api/inventory/${id}`);
      if (response.status === 204) {
        setInventory(inventory.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const generatePDF = (recipe) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(52, 152, 219);
    doc.text(recipe.recipeName, 105, 20, { align: 'center' });
    
    // Add image if available
    if (recipe.recipeImage) {
      try {
        const img = new Image();
        img.src = `http://localhost:8080/api/uploads/${recipe.recipeImage}`;
        img.onload = function() {
          doc.addImage(img, 'JPEG', 15, 30, 180, 120);
          addRecipeDetails(doc, recipe, 160);
        };
      } catch (error) {
        console.error('Error loading image:', error);
        addRecipeDetails(doc, recipe, 30);
      }
    } else {
      addRecipeDetails(doc, recipe, 30);
    }
    
    // Save the PDF
    doc.save(`${recipe.recipeName}_recipe.pdf`);
  };

  const addRecipeDetails = (doc, recipe, startY) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Recipe details
    doc.setFont(undefined, 'bold');
    doc.text('Recipe Details:', 15, startY + 20);
    doc.setFont(undefined, 'normal');
    const splitDetails = doc.splitTextToSize(recipe.recipeDetails, 180);
    doc.text(splitDetails, 15, startY + 30);
    
    // Other information
    doc.setFont(undefined, 'bold');
    doc.text('Category:', 15, startY + 50);
    doc.setFont(undefined, 'normal');
    doc.text(recipe.recipeCategory, 50, startY + 50);
    
    doc.setFont(undefined, 'bold');
    doc.text('Quantity:', 15, startY + 60);
    doc.setFont(undefined, 'normal');
    doc.text(recipe.recipeQty.toString(), 50, startY + 60);
    
    doc.setFont(undefined, 'bold');
    doc.text('Price:', 15, startY + 70);
    doc.setFont(undefined, 'normal');
    doc.text(`$${recipe.recipePrice}`, 50, startY + 70);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Recipe ID: ${recipe.recipeId}`, 15, 280);
    doc.text('Generated by Recipe Management System', 105, 280, { align: 'center' });
  };

  useEffect(() => {
    loadInventory();
  }, []);

  return (
    <Container>
      <Title>Recipe Inventory</Title>
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Recipe ID</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Qty</Th>
              <Th>Details</Th>
              <Th>Price</Th>
              <Th>Image</Th>
              <Th style={{ textAlign: 'center' }}>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <Tr 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Td>
                  {item.recipeId}
                  <br />
                  <small style={{ color: '#888' }}>{item.id}</small>
                </Td>
                <Td>{item.recipeName}</Td>
                <Td>{item.recipeCategory}</Td>
                <Td>{item.recipeQty}</Td>
                <Td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.recipeDetails}
                </Td>
                <Td>${item.recipePrice}</Td>
                <Td>
                  {item.recipeImage && (
                    <ImagePreview
                      src={`http://localhost:8080/api/uploads/${item.recipeImage}`}
                      alt={item.recipeName}
                    />
                  )}
                </Td>
                <Td style={{ textAlign: 'center' }}>
                  <DownloadButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generatePDF(item)}
                  >
                    <i className="fas fa-download"></i> PDF
                  </DownloadButton>
                  <UpdateButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = `/updaterecipe/${item.id}`}
                  >
                    <i className="fas fa-edit"></i> Update
                  </UpdateButton>
                  <DeleteButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                    Delete
                  </DeleteButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Displayrecipe;