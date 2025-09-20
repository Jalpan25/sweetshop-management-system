// src/api/sweetApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// Get all sweets
export const getAllSweets = async () => {
  return await axios.get(`${API_BASE_URL}/sweets`, {
    headers: getAuthHeaders()
  });
};

// Search sweets
export const searchSweets = async (params) => {
  return await axios.get(`${API_BASE_URL}/sweets/search`, {
    headers: getAuthHeaders(),
    params
  });
};

// Add new sweet
export const addSweet = async (sweetData) => {
  return await axios.post(`${API_BASE_URL}/sweets`, sweetData, {
    headers: getAuthHeaders()
  });
};

// Update sweet
export const updateSweet = async (id, sweetData) => {
  return await axios.put(`${API_BASE_URL}/sweets/${id}`, sweetData, {
    headers: getAuthHeaders()
  });
};

// Delete sweet
export const deleteSweet = async (id) => {
  return await axios.delete(`${API_BASE_URL}/sweets/${id}`, {
    headers: getAuthHeaders()
  });
};

// Purchase sweet
export const purchaseSweet = async (id) => {
  return await axios.post(`${API_BASE_URL}/sweets/${id}/purchase`, {}, {
    headers: getAuthHeaders()
  });
};

// Restock sweet
export const restockSweet = async (id, quantity) => {
  return await axios.post(`${API_BASE_URL}/sweets/${id}/restock`, 
    { quantity }, 
    { headers: getAuthHeaders() }
  );
};