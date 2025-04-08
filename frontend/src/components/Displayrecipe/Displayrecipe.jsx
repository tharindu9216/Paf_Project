import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Displayrecipe() {
    const [inventory, setInventory] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const result = await axios.get("http://localhost:8080/api/inventory");
            setInventory(result.data);
        } catch (error) {
            console.error("Error loading inventory:", error);
        }
    };

    const handleDelete = (recipeId) => {
        console.log("Delete recipe with ID:", recipeId);
        // Add code to handle deletion here (e.g., make an API call to delete the recipe)
    };

    const containerStyle = {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const headingStyle = {
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        borderRadius: '6px',
        overflow: 'hidden',
    };

    const theadStyle = {
        backgroundColor: '#007bff',
        color: 'white',
    };

    const thTdStyle = {
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    };

    const lastThTdStyle = {
        textAlign: 'center',
    };

    const trEvenStyle = {
        backgroundColor: '#f9f9f9',
    };

    const imageContainerStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const deleteButtonStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease-in-out',
    };

    const deleteButtonHoverStyle = {
        backgroundColor: '#c82333',
        transform: 'scale(1.05)',
    };

    const trStyle = {
        transition: 'background-color 0.3s ease, transform 0.2s ease-in-out',
    };

    const trHoverStyle = {
        backgroundColor: '#e9ecef',
        transform: 'scale(1.02)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Display Recipe</h1>
            <table style={tableStyle}>
                <thead style={theadStyle}>
                    <tr>
                        <th style={thTdStyle}>Recipe ID</th>
                        <th style={thTdStyle}>Recipe Image</th>
                        <th style={thTdStyle}>Recipe Name</th>
                        <th style={thTdStyle}>Recipe Category</th>
                        <th style={thTdStyle}>Quantity</th>
                        <th style={thTdStyle}>Details</th>
                        <th style={thTdStyle}>Price (LKR)</th>
                        <th style={{ ...thTdStyle, ...lastThTdStyle }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.recipeId} style={trStyle} onMouseOver={(e) => Object.assign(e.currentTarget.style, trHoverStyle)} onMouseOut={(e) => Object.assign(e.currentTarget.style, trStyle)}>
                            <td style={thTdStyle}>{item.recipeId}</td>
                            <td style={thTdStyle}>
                                <div style={imageContainerStyle}>
                                    <img
                                        src={`http://localhost:8080/api/uploads/${item.recipeImage}`}
                                        alt={item.recipeName}
                                        style={imageStyle}
                                    />
                                </div>
                            </td>
                            <td style={thTdStyle}>{item.recipeName}</td>
                            <td style={thTdStyle}>{item.recipeCategory}</td>
                            <td style={thTdStyle}>{item.recipeQty}</td>
                            <td style={thTdStyle}>{item.recipeDetails}</td>
                            <td style={thTdStyle}>{item.recipePrice}</td>
                            <td style={{ ...thTdStyle, ...lastThTdStyle }}>
                                <button
                                    onClick={() => handleDelete(item.recipeId)}
                                    style={deleteButtonStyle}
                                    onMouseOver={(e) => Object.assign(e.currentTarget.style, deleteButtonHoverStyle)}
                                    onMouseOut={(e) => Object.assign(e.currentTarget.style, deleteButtonStyle)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Displayrecipe;