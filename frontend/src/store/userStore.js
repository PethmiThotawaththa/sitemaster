import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import userService from '../services/userService';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isSupplier: false,
      isCustomer: false,
      loading: false,
      error: null,

      // Login user
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.login({ email, password });
          const { token, ...userData } = response;
          localStorage.setItem('token', token);
          set({
            user: userData,
            isAuthenticated: true,
            isAdmin: userData.role === 'admin',
            isSupplier: userData.role === 'supplier',
            isCustomer: userData.role === 'customer',
            loading: false,
          });
        } catch (error) {
          console.error('Login error:', error);
          set({
            error: error.message || 'Login failed',
            loading: false,
          });
          throw error;
        }
      },

      // Register new user
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await userService.register(userData);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            error: error.message || 'Registration failed',
            loading: false,
          });
          throw error;
        }
      },

      // Register new admin user
      registerAdmin: async (userData) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          const response = await userService.registerAdmin(userData, token);
          set({ loading: false });
          return response;
        } catch (error) {
          set({
            error: error.message || 'Admin registration failed',
            loading: false,
          });
          throw error;
        }
      },

      // Logout user
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isSupplier: false,
          isCustomer: false,
          error: null,
        });
      },

      // Forgot password
      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          await userService.forgotPassword(email);
          set({ loading: false });
        } catch (error) {
          set({
            error: error.message || 'Failed to send reset email',
            loading: false,
          });
          throw error;
        }
      },

      // Reset password
      resetPassword: async (token, newPassword) => {
        set({ loading: true, error: null });
        try {
          await userService.resetPassword(token, newPassword);
          set({ loading: false });
        } catch (error) {
          set({
            error: error.message || 'Failed to reset password',
            loading: false,
          });
          throw error;
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          const response = await userService.updateProfile(profileData, token);
          set({
            user: response,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message || 'Failed to update profile',
            loading: false,
          });
          throw error;
        }
      },

      // Fetch user profile
      getProfile: async () => {
        set({ loading: true, error: null });
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ loading: false, error: 'No token found' });
            return;
          }
          const response = await userService.getProfile(token);
          set({
            user: response,
            isAuthenticated: true,
            isAdmin: response.role === 'admin',
            isSupplier: response.role === 'supplier',
            isCustomer: response.role === 'customer',
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch profile',
            loading: false,
          });
          throw error;
        }
      },

      // Check authentication status
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isAdmin: false, isSupplier: false, isCustomer: false });
          return;
        }

        set({ loading: true });
        try {
          const response = await userService.getProfile(token);
          set({
            user: response,
            isAuthenticated: true,
            isAdmin: response.role === 'admin',
            isSupplier: response.role === 'supplier',
            isCustomer: response.role === 'customer',
            loading: false,
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            isAuthenticated: false,
            user: null,
            isAdmin: false,
            isSupplier: false,
            isCustomer: false,
            loading: false,
          });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        isSupplier: state.isSupplier,
        isCustomer: state.isCustomer,
      }),
    }
  )
);

export default useUserStore;