import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosConfig';

const useInventoryStore = create(
  persist(
    (set, get) => ({
      inventory: [],
      loading: false,
      error: null,
      searchTerm: '',
      filters: {
        category: 'all',
        supplier: 'all',
      },
      lastFetch: null,

      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

      getFilteredItems: () => {
        const { inventory, searchTerm, filters } = get();
        const items = Array.isArray(inventory) ? inventory : [];
        return items.filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesCategory = filters.category === 'all' || item.category === filters.category;
          const matchesSupplier = filters.supplier === 'all' || item.supplier === filters.supplier;
          return matchesSearch && matchesCategory && matchesSupplier;
        });
      },

      fetchInventory: async () => {
        const state = get();
        if (state.loading) {
          return;
        }

        const now = Date.now();
        if (state.lastFetch && now - state.lastFetch < 60000) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get('/api/inventory');
          const inventoryData = Array.isArray(response.data) ? response.data : [];
          // Log inventory items and image URLs
          console.log('Inventory items:', inventoryData.map(item => ({
            id: item._id,
            name: item.name,
            imagePath: item.images && item.images.length > 0 
              ? `${import.meta.env.VITE_API_URL}${item.images[0]}`
              : 'no image'
          })));
          inventoryData.forEach((item) => {
            const imageUrl = item.images?.[0] ? `${import.meta.env.VITE_API_URL}${item.images[0]}` : null;
            if (imageUrl) {
              console.log(`Image URL for ${item.name}:`, imageUrl);
            }
          });
          set({ 
            inventory: inventoryData, 
            loading: false,
            lastFetch: now,
            error: null
          });
        } catch (error) {
          console.error('Error fetching inventory:', error);
          set({ 
            inventory: [],
            error: error.response?.data?.message || error.message || 'Failed to fetch inventory',
            loading: false 
          });
        }
      },

      addItem: async (itemData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/api/inventory', itemData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          set((state) => ({
            inventory: [...state.inventory, response.data],
            loading: false,
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },

      updateItem: async (id, itemData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put(`/api/inventory/${id}`, itemData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          set((state) => ({
            inventory: state.inventory.map((item) =>
              item._id === id ? response.data : item
            ),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },

      deleteItem: async (id) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/api/inventory/${id}`);
          set((state) => ({
            inventory: state.inventory.filter((item) => item._id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },

      generateReport: async (type) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(`/api/inventory/report/${type}`, {
            responseType: 'blob',
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `inventory-report-${type}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          set({ loading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || error.message, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'inventory-storage',
      partialize: (state) => ({
        inventory: state.inventory,
        lastFetch: state.lastFetch
      }),
    }
  )
);

export default useInventoryStore;