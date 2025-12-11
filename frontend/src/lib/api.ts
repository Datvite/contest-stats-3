import axios, { AxiosInstance } from 'axios';

/**
 * API client for interacting with the FastAPI backend
 * Configured with base URL and default headers
 */
const api: AxiosInstance = axios.create({
  baseURL: 'http://98.70.34.119:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Attach admin token if available
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (localStorage not available in some environments)
  }
  return config;
});

export { api };
