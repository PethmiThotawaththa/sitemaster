import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      setUser: (userData) => set({ user: userData }),
      setToken: (token) => set({ token }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setAdmin: (status) => set({ isAdmin: status }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isAdmin: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore; 