import axios from 'axios';

// Don't set /api as baseURL since the Vite proxy handles that
const axiosInstance = axios.create({
  baseURL: '', // Remove the /api prefix
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    console.log('Token in request:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;