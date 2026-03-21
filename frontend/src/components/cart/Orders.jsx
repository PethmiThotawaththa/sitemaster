import React, { useEffect, useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/orders/my-orders');
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch orders',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getImagePath = (item) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const itemData = item.item || {};
    const imagePath =
      item.itemType === 'Inventory'
        ? itemData.images?.[0]
        : itemData.attachments?.[0];

    // If imagePath exists, construct the full URL; otherwise, use placeholder
    if (imagePath) {
      // Ensure the path starts with a forward slash
      const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${baseUrl}${normalizedPath}`;
    }
    return 'https://via.placeholder.com/50';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!orders.length) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Text>You have no orders yet.</Text>
          <Button colorScheme="blue" onClick={() => navigate('/inventory')}>
            Start Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Your Orders</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order Date</Th>
              <Th>Items</Th>
              <Th>Total Amount</Th>
              <Th>Payment Status</Th>
              <Th>Order Status</Th>
              <Th>Delivery Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                <Td>
                  {order.items.map((item, index) => (
                    <HStack key={index} spacing={3} mb={2}>
                      <Image
                        src={getImagePath(item)}
                        alt={item.item?.name || `Item ${index}`}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                        onError={(e) => {
                          console.error(`Failed to load image for item ${item.item?.name || index}: ${getImagePath(item)}`);
                          e.target.src = 'https://via.placeholder.com/50'; // Fallback on error
                        }}
                      />
                      <VStack align="start">
                        <Text>{item.item?.name || 'Unknown Item'}</Text>
                        <Text fontSize="sm">Type: {item.itemType}</Text>
                        <Text fontSize="sm">Quantity: {item.quantity || 0}</Text>
                        <Text fontSize="sm">Price: ${item.price?.toFixed(2) || '0.00'}</Text>
                      </VStack>
                    </HStack>
                  ))}
                </Td>
                <Td>${order.totalAmount?.toFixed(2) || '0.00'}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      order.payment?.status === 'verified'
                        ? 'green'
                        : order.payment?.status === 'rejected'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {order.payment?.status || 'pending'}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </Td>
                <Td>{order.deliveryAddress || 'N/A'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button colorScheme="blue" onClick={() => navigate('/inventory')}>
          Continue Shopping
        </Button>
      </VStack>
    </Container>
  );
};

export default Orders;