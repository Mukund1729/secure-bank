import axios from 'axios';

// 1. Determine the base URL
// If the app is running in production (Render), use the Render Backend URL.
// If running locally, use localhost.
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api' 
  : 'https://banking-backend.onrender.com/api'; // <--- REPLACE THIS LATER with your actual Render Backend URL

// 2. Create the Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

// 3. Add a request interceptor to attach the JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store the JWT as 'token'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
