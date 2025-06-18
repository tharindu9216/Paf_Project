import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import 'jspdf-autotable';

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 0.5rem;
  width: 100%;
  font-size: 1rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-top: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 18px 24px;
  text-align: left;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  position: sticky;
  top: 0;
`;

const Td = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.95rem;
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
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.85rem;
  margin: 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 90px;
  justify-content: center;
`;

const DeleteButton = styled(ActionButton)`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  &:hover {
    background: linear-gradient(135deg, #ff6b6b, #e74c3c);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }
`;

const UpdateButton = styled(ActionButton)`
  background: linear-gradient(135deg, #00b894, #55efc4);
  &:hover {
    background: linear-gradient(135deg, #48b048, #a3dc4f);
    box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
  }
`;

const DownloadButton = styled(ActionButton)`
  background: linear-gradient(135deg, #0984e3, #74b9ff);
  &:hover {
    background: linear-gradient(135deg, #5dade2, #3498db);
    box-shadow: 0 4px 12px rgba(9, 132, 227, 0.3);
  }
`;

const ImagePreview = styled(motion.img)`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(2.5);
    z-index: 100;
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(108, 92, 231, 0.1);
  border-radius: 50%;
  border-top-color: #6c5ce7;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? '#6c5ce7' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#6c5ce7' : '#f1f1f1'};
  }
`;

const RecipeDetailsModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 15px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 1.5rem;
`;

const itemsPerPage = 5; // Define items per page

function Displayrecipe() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get("http://localhost:8080/api/inventory");
      setInventory(result.data);
      setFilteredInventory(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading inventory:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    const results = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(results);
    setCurrentPage(1);
  }, [searchTerm, inventory]);

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

  const generatePremiumPDF = async (recipe) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Cover Page
      doc.setFillColor(108, 92, 231);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text(recipe.name, 105, 60, { align: 'center', maxWidth: 180 });
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(recipe.category, 105, 80, { align: 'center' });
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.line(60, 85, 150, 85);
      
      // Add image if available
      if (recipe.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = `http://localhost:8080/uploads/${recipe.imageUrl}`;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const imgWidth = 100;
          const imgHeight = (img.height * imgWidth) / img.width;
          
          doc.addImage(imgData, 'JPEG', 55, 90, imgWidth, imgHeight);
        } catch (error) {
          console.error('Error processing image:', error);
          doc.setFontSize(12);
          doc.text('Recipe Image', 105, 110, { align: 'center' });
        }
      } else {
        doc.setFontSize(12);
        doc.text('No Image Available', 105, 110, { align: 'center' });
      }
      
      doc.setFontSize(10);
      doc.text('Gourmet Recipe Collection', 105, 280, { align: 'center' });
      
      // Details Page
      doc.addPage();
      
      doc.setFillColor(255, 255, 255);
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(recipe.name, 15, 20);
      
      doc.setDrawColor(108, 92, 231);
      doc.setLineWidth(0.8);
      doc.line(15, 25, 60, 25);
      
      // Recipe Metadata Table
      doc.autoTable({
        startY: 30,
        head: [['Category', 'Quantity', 'Price']],
        body: [[
          recipe.category, 
          recipe.quantity, 
          `LKR ${parseFloat(recipe.price).toFixed(2)}`
        ]],
        theme: 'grid',
        headStyles: {
          fillColor: [108, 92, 231],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          cellPadding: 5,
          fontSize: 12,
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'left' },
          1: { halign: 'center' },
          2: { halign: 'right' }
        }
      });
      
      // Recipe Details
      doc.setFontSize(16);
      doc.setTextColor(108, 92, 231);
      doc.text('Recipe Details', 15, 60);
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      const splitDetails = doc.splitTextToSize(recipe.description, 180);
      doc.text(splitDetails, 15, 70);
      
      // Ingredients Section
      doc.setFontSize(16);
      doc.setTextColor(108, 92, 231);
      doc.text('Ingredients', 15, doc.autoTable.previous.finalY + 15);
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      
      // Check if ingredients is an array or string
      const ingredientsList = Array.isArray(recipe.ingredients) 
        ? recipe.ingredients 
        : recipe.ingredients 
          ? recipe.ingredients.split('\\n') 
          : ['No ingredients listed'];
      
      ingredientsList.forEach((ingredient, index) => {
        doc.text(`• ${ingredient.trim()}`, 20, doc.autoTable.previous.finalY + 25 + (index * 7));
      });
      
      // Instructions Section
      doc.setFontSize(16);
      doc.setTextColor(108, 92, 231);
      doc.text('Instructions', 15, doc.autoTable.previous.finalY + 15);
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      
      // Check if instructions is an array or string
      const instructionsList = Array.isArray(recipe.instructions) 
        ? recipe.instructions 
        : recipe.instructions 
          ? recipe.instructions.split('\\n') 
          : ['No instructions provided'];
      
      instructionsList.forEach((step, index) => {
        const stepText = doc.splitTextToSize(`${index + 1}. ${step.trim()}`, 180);
        doc.text(stepText, 20, doc.autoTable.previous.finalY + 25);
        doc.autoTable.previous.finalY += stepText.length * 7;
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Recipe ID: ${recipe.id}`, 15, 280);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 280, { align: 'center' });
      doc.text('Page 2 of 2', 195, 280, { align: 'right' });
      
      // Save PDF
      doc.save(`${recipe.name.replace(/[/\\?%*:|\"<>]/g, '_')}_Recipe.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (item) => {
    setSelectedRecipe(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setShowModal(false);
  };

  return (
    <Container>
      <Header>
        <Title>All Recipes</Title>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Add search icon here if desired */}
        </SearchBar>
      </Header>

      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th>Recipe Name</Th>
                <Th>Category</Th>
                <Th>Quantity</Th>
                <Th>Price (LKR)</Th>
                <Th style={{ textAlign: 'center' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <Tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Td>
                    {item.imageUrl && (
                      <ImagePreview
                        src={`http://localhost:8080/uploads/${item.imageUrl}`}
                        alt={item.name}
                        onClick={() => openModal(item)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Td>
                  <Td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                      ID: {item.id}
                    </div>
                  </Td>
                  <Td>{item.category}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{`LKR ${item.price?.toFixed(2)}`}</Td>
                  <Td style={{ textAlign: 'center' }}>
                    <UpdateButton
                      onClick={() => window.location.href = `/updaterecipe/${item.id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Update
                    </UpdateButton>
                    <DeleteButton
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </DeleteButton>
                    <DownloadButton
                      onClick={() => generatePremiumPDF(item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Download PDF
                    </DownloadButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            onClick={() => paginate(i + 1)}
            active={i + 1 === currentPage}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>

      {showModal && selectedRecipe && (
        <RecipeDetailsModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModalContent
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CloseButton onClick={closeModal}>X</CloseButton>
            
            {selectedRecipe.imageUrl && (
              <ModalImage
                src={`http://localhost:8080/uploads/${selectedRecipe.imageUrl}`}
                alt={selectedRecipe.name}
              />
            )}
            
            <h2 style={{ color: '#6c5ce7', marginBottom: '1rem' }}>{selectedRecipe.name}</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}><strong>Category:</strong> {selectedRecipe.category}</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>Details</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{selectedRecipe.description}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>Quantity</h4>
                <p>{selectedRecipe.quantity}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>Price</h4>
                <p>LKR {selectedRecipe.price?.toFixed(2)}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#6c5ce7', marginBottom: '0.5rem' }}>Recipe ID</h4>
                <p>{selectedRecipe.id}</p>
              </div>
            </div>
          </ModalContent>
        </RecipeDetailsModal>
      )}
    </Container>
  );
}

export default Displayrecipe;