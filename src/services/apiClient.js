// src/services/apiClient.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const apiClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;