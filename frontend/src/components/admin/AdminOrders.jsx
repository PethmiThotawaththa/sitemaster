import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  Spinner,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { DeleteIcon, SearchIcon, CloseIcon } from '@chakra-ui/icons';
import axiosInstance from '../../utils/axiosConfig';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders whenever searchQuery changes
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = orders.filter((order) =>
        order._id.toLowerCase().includes(query) ||
        (order.user?.name?.toLowerCase() || '').includes(query) ||
        order.status.toLowerCase().includes(query)
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    console.log('AdminOrders: Fetching orders, token:', token ? 'Present' : 'Missing');
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/admin/orders');
      console.log('AdminOrders: Fetched orders:', response.data);
      setOrders(response.data);
      setFilteredOrders(response.data); // Initialize filteredOrders
    } catch (error) {
      if (error.response?.status === 401) {
        // Let the axios interceptor handle the redirect
        throw error;
      }
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast({
        title: 'Error fetching orders',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: 'Order status updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      toast({
        title: 'Error updating order status',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axiosInstance.delete(`/api/admin/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
      toast({
        title: 'Order deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete order';
      toast({
        title: 'Error deleting order',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Loading orders...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} textAlign="center">
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Order Management</Heading>
          <Text color="gray.500">Manage and track customer orders</Text>
        </Box>

        {/* Search Bar */}
        <Box>
          <InputGroup maxW="400px">
            <Input
              placeholder="Search by Order ID, Customer, or Status"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <InputRightElement width="4.5rem">
              {searchQuery ? (
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  variant="ghost"
                />
              ) : (
                <SearchIcon color="gray.300" />
              )}
            </InputRightElement>
          </InputGroup>
        </Box>

        {filteredOrders.length === 0 ? (
          <Text textAlign="center">
            {searchQuery ? 'No orders match your search' : 'No orders found'}
          </Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Total Amount</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>{order.user?.name || 'Unknown'}</Td>
                  <Td>${order.totalAmount.toFixed(2)}</Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        order.status === 'delivered'
                          ? 'green'
                          : order.status === 'pending'
                          ? 'yellow'
                          : order.status === 'cancelled'
                          ? 'red'
                          : 'blue'
                      }
                    >
                      {order.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      size="sm"
                      width="150px"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteOrder(order._id)}
                      aria-label="Delete order"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  );
};

export default AdminOrders;