import axios, { AxiosInstance } from 'axios';

/**
 * API client for interacting with the FastAPI backend
 * Configured with base URL and default headers
 * Uses localhost in development, remote server in production
 */
const getBaseURL = (): string => {
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  // Otherwise use the remote server
  return 'http://98.70.34.119:8000';
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('admin_token');
      // If we're on admin page, redirect to login
      if (window.location.pathname.includes('/admin')) {
        // Trigger a page reload to show login form
        window.location.reload();
      }
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Attach admin token if available
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      // Ensure we set the Authorization header correctly
      config.headers['Authorization'] = `Bearer ${token.trim()}`;
    }
  } catch (e) {
    // ignore (localStorage not available in some environments)
    console.warn('Failed to get token from localStorage:', e);
  }
  return config;
});

export { api };
