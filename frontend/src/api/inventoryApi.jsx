// src/api/inventoryApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with token
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Purchase a sweet (decreases quantity)
export const purchaseSweet = async (sweetId, quantity = 1) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post(`/sweets/${sweetId}/purchase`, {
      quantity: quantity
    });
    return response;
  } catch (error) {
    console.error('Error purchasing sweet:', error);
    throw error;
  }
};

// Restock a sweet (increases quantity - Admin only)
export const restockSweet = async (sweetId, quantity) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post(`/sweets/${sweetId}/restock`, {
      quantity: quantity
    });
    return response;
  } catch (error) {
    console.error('Error restocking sweet:', error);
    throw error;
  }
};