import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000',
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: import.meta.env.VITE_BASE_URL_RENDER,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;