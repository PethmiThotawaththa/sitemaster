import { create } from 'zustand';
import userService from '../services/userService';

const useAdminUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  // Fetch all users (admin only)
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await userService.getAllUsers(token);
      set({ users: response, loading: false });
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch users',
        loading: false,
      });
      throw error;
    }
  },

  // Delete a user (admin only)
  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await userService.deleteUser(userId, token);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.message || 'Failed to delete user',
        loading: false,
      });
      throw error;
    }
  },

  // Update a user (admin only)
  updateUser: async (userId, userData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await userService.updateUser(userId, userData, token);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, ...response } : user
        ),
        loading: false,
      }));
      return response;
    } catch (error) {
      set({
        error: error.message || 'Failed to update user',
        loading: false,
      });
      throw error;
    }
  },
}));

export default useAdminUserStore;