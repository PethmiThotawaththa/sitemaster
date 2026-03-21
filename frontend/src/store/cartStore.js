import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axiosConfig';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      fetchCart: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ cart: null, error: 'Please log in to view your cart' });
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get('/api/cart');
          set({ cart: response.data, loading: false });
        } catch (error) {
          console.error('Error fetching cart:', error.response?.status, error.response?.data || error.message);
          set({ error: error.response?.data?.message || error.message || 'Failed to fetch cart', loading: false });
          throw error;
        }
      },

      addToCart: async (itemId, itemType, quantity = 1) => {
        set({ loading: true, error: null });
        try {
          // Check inventory quantity if itemType is Inventory
          if (itemType === 'Inventory') {
            const response = await axiosInstance.get(`/api/inventory/quantity/${itemId}`);
            const { quantity: availableQuantity, name } = response.data;
            if (availableQuantity < quantity) {
              throw new Error(`Insufficient quantity for ${name}. Only ${availableQuantity} available.`);
            }
          }

          const response = await axiosInstance.post(
            '/api/cart/add',
            { itemId, itemType, quantity }
          );
          set({ cart: response.data, loading: false });
        } catch (error) {
          console.error('Error adding to cart:', error.response?.status, error.response?.data || error.message);
          set({ error: error.response?.data?.message || error.message || 'Failed to add to cart', loading: false });
          throw error;
        }
      },

      removeFromCart: async (itemId, itemType) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.delete(
            `/api/cart/remove/${itemId}/${itemType}`
          );
          set({ cart: response.data, loading: false });
        } catch (error) {
          console.error('Error removing from cart:', error.response?.status, error.response?.data || error.message);
          set({ error: error.response?.data?.message || error.message || 'Failed to remove from cart', loading: false });
          throw error;
        }
      },

      updateQuantity: async (itemId, itemType, quantity) => {
        set({ loading: true, error: null });
        try {
          const parsedQuantity = parseInt(quantity);
          if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            throw new Error('Invalid quantity');
          }

          // Check inventory quantity if itemType is Inventory
          if (itemType === 'Inventory') {
            const response = await axiosInstance.get(`/api/inventory/quantity/${itemId}`);
            const { quantity: availableQuantity, name } = response.data;
            if (availableQuantity < parsedQuantity) {
              throw new Error(`Insufficient quantity for ${name}. Only ${availableQuantity} available.`);
            }
          }

          const response = await axiosInstance.post('/api/cart/add', {
            itemId,
            itemType,
            quantity: parsedQuantity,
          });

          set({ cart: response.data, loading: false });
        } catch (error) {
          console.error('Error updating quantity:', error.response?.status, error.response?.data || error.message);
          set({
            error: error.response?.data?.message || error.message || 'Failed to update quantity',
            loading: false,
          });
          throw error;
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          const cart = get().cart;
          if (!cart) return;

          for (const item of cart.items) {
            await axiosInstance.delete(
              `/api/cart/remove/${item.item._id}/${item.itemType}`
            );
          }
          set({ cart: null, loading: false, error: null });
        } catch (error) {
          console.error('Error clearing cart:', error.response?.status, error.response?.data || error.message);
          set({ error: error.response?.data?.message || error.message || 'Failed to clear cart', loading: false });
          throw error;
        }
      },

      getTotal: () => {
        const cart = get().cart;
        if (!cart) return 0;
        return cart.totalAmount || 0;
      },

      getItemCount: () => {
        const cart = get().cart;
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((count, item) => count + item.quantity, 0);
      },

      checkout: async (paymentDetails) => {
        const cart = get().cart;
        if (!cart || !cart.items.length) {
          throw new Error('Cart is empty');
        }

        set({ loading: true, error: null });
        try {
          const paymentFormData = new FormData();
          paymentFormData.append('paymentSlip', paymentDetails.paymentSlip);

          const paymentResponse = await axiosInstance.post('/api/payments', paymentFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const paymentId = paymentResponse.data._id;

          const orderData = {
            user: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).sub,
            items: cart.items.map((item) => ({
              item: item.item._id,
              itemType: item.itemType,
              quantity: item.quantity,
              price: item.itemType === 'Inventory' ? item.item.price : item.item.budget,
            })),
            totalAmount: get().getTotal(),
            payment: paymentId,
            deliveryAddress: paymentDetails.deliveryAddress,
          };

          console.log('Sending order request:', JSON.stringify(orderData, null, 2));

          const orderResponse = await axiosInstance.post('/api/orders', orderData);

          // Cart is cleared server-side, so fetch the updated cart
          await get().fetchCart();
          set({ loading: false });

          return orderResponse.data;
        } catch (error) {
          console.error('Error during checkout:', error.response?.status, error.response?.data || error.message);
          set({ error: error.response?.data?.message || error.message || 'Failed to checkout', loading: false });
          throw error;
        }
      },

      initializeCart: async () => {
        const token = localStorage.getItem('token');
        console.log('Initializing cart, token:', token ? 'Present' : 'Missing');
        if (!token) {
          set({ error: 'Please log in to view your cart' });
          return;
        }

        set({ loading: true, error: null });
        try {
          console.log('Fetching cart from /api/cart');
          const response = await axiosInstance.get('/api/cart');
          console.log('Cart fetch response:', response.data);
          set({ cart: response.data, loading: false });
        } catch (error) {
          console.error('Failed to initialize cart:', error.response?.status, error.response?.data || error.message);
          set({ error: error.response?.data?.message || error.message || 'Failed to initialize cart', loading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

useCartStore.getState().initializeCart();

export default useCartStore;