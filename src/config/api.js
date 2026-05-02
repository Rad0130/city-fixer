// API configuration based on environment
const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction 
  ? import.meta.env.VITE_API_URL || 'https://your-backend.vercel.app'
  : 'http://localhost:3000';

export default API_BASE_URL;