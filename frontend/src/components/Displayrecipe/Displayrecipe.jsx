import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Displayrecipe() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Function to load inventory items from the backend
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

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/inventory/${id}`);
      if (response.status === 204) {
        // Filter out the deleted item from the state
        setInventory(inventory.filter(item => item.recipeId !== id));
        console.log('Item deleted');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Table and button styling
  const tableStyle = {
    width: '90%',
    borderCollapse: 'collapse',
    margin: '30px auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  };

  const thTdStyle = {
    padding: '12px 18px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
    fontSize: '14px',
  };

  const thStyle = {
    background: '#ff7675',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontSize: '13px',
  };

  const lastThTdStyle = {
    textAlign: 'center',
  };

  const deleteButtonStyle = {
    padding: '6px 14px',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const deleteButtonHoverStyle = {
    background: 'linear-gradient(135deg, #ff6b6b, #e74c3c)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(231, 76, 60, 0.3)',
  };

  const updateButtonStyle = {
    ...deleteButtonStyle,
    background: 'linear-gradient(135deg, #6ab04c, #badc58)',
    marginLeft: '10px',
  };

  const updateButtonHoverStyle = {
    background: 'linear-gradient(135deg, #48b048, #a3dc4f)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(106, 176, 76, 0.3)',
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#2d3436' }}>Inventory</h2>
      {isLoading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thTdStyle, ...thStyle }}>ID</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Name</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Category</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Qty</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Details</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Price</th>
              <th style={{ ...thTdStyle, ...thStyle }}>Image</th>
              <th style={{ ...thTdStyle, ...thStyle, ...lastThTdStyle }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={item.recipeId}>
                <td style={thTdStyle}>{item.recipeId}</td>
                <td style={thTdStyle}>{item.recipeName}</td>
                <td style={thTdStyle}>{item.recipeCategory}</td>
                <td style={thTdStyle}>{item.recipeQty}</td>
                <td style={thTdStyle}>{item.recipeDetails}</td>
                <td style={thTdStyle}>${item.recipePrice}</td>
                <td style={thTdStyle}>
                  {item.recipeImage && (
                    <img
                      src={`http://localhost:8080/api/uploads/${item.recipeImage}`}
                      alt={item.recipeName}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td style={{ ...thTdStyle, ...lastThTdStyle }}>
                  <button
                    onClick={() => handleDelete(item.recipeId)}
                    style={hoveredButton === `delete-${index}` ? { ...deleteButtonStyle, ...deleteButtonHoverStyle } : deleteButtonStyle}
                    onMouseEnter={() => setHoveredButton(`delete-${index}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => window.location.href = `/updaterecipe/${item.recipeId}`}
                    style={hoveredButton === `update-${index}` ? { ...updateButtonStyle, ...updateButtonHoverStyle } : updateButtonStyle}
                    onMouseEnter={() => setHoveredButton(`update-${index}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Displayrecipe;
