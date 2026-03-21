import axios from '../utils/axiosConfig'; // Use the configured axios instance

const userService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Register a new admin user
  registerAdmin: async (userData) => {
    try {
      const response = await axios.post('/api/auth/admin/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin registration failed');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await axios.get('/api/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Update user status (admin only)
  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.put(`/api/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  },

  // Update a user (admin only)
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete a user (admin only)
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },
};

export default userService;