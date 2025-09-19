import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = async (name, email, password, role) => {
  return await axios.post(`${API_URL}/register`, { name, email, password, role });
};
