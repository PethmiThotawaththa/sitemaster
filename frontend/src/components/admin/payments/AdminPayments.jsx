import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Image,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from '../../../utils/axiosConfig';
import { getPaymentImageUrl, handleImageError } from '../../../utils/imageUtils';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();
  const renderCount = useRef(0);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      console.log('Fetching payments from /api/payments/all');
      const response = await axios.get('/api/payments/all');
      console.log('Payments response:', response.data);
      const fetchedPayments = Array.isArray(response.data) ? response.data : [];
      setPayments(fetchedPayments);
      setFilteredPayments(fetchedPayments);
      console.log('Updated payments state:', fetchedPayments);
      if (fetchedPayments.length === 0) {
        console.log('No payments found in response');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setFilteredPayments([]);
      console.log('Updated payments state on error:', []);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch payments',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    console.log('useEffect triggered');
    if (isMounted) {
      fetchPayments();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Render #${renderCount.current} with payments:`, payments);
  });

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = payments.filter(payment =>
      payment.user?.name?.toLowerCase().includes(query) ||
      payment.user?.email?.toLowerCase().includes(query) ||
      payment.amount.toString().includes(query) ||
      payment.status.toLowerCase().includes(query)
    );
    setFilteredPayments(filtered);
  };

  const handleStatusUpdate = async (paymentId, status) => {
    try {
      await axios.put(`/api/payments/${paymentId}`, { status });
      fetchPayments();
      toast({
        title: 'Success',
        description: `Payment marked as ${status}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (paymentId) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      await axios.delete(`/api/payments/${paymentId}`);
      fetchPayments();
      toast({
        title: 'Success',
        description: 'Payment deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete payment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'yellow';
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Loading payments...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Payment Management</Heading>

        <HStack spacing={4}>
          <FormControl maxW="300px">
            <FormLabel>Search Payments</FormLabel>
            <Input
              placeholder="Search by customer, email, amount, or status"
              value={searchQuery}
              onChange={handleSearch}
            />
          </FormControl>
        </HStack>

        {filteredPayments.length === 0 ? (
          <Text>No payments found.</Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Payment Slip</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPayments.map((payment) => (
                  <Tr key={payment._id}>
                    <Td>{new Date(payment.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      {payment.user?.name} ({payment.user?.email})
                    </Td>
                    <Td>${payment.amount.toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        onClick={() => setSelectedImage(payment.paymentSlip)}
                      >
                        View Slip
                      </Button>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<ChevronDownIcon />}
                          variant="outline"
                        />
                        <MenuList>
                          <MenuItem
                            onClick={() => handleStatusUpdate(payment._id, 'verified')}
                          >
                            Mark as Verified
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleStatusUpdate(payment._id, 'rejected')}
                          >
                            Mark as Rejected
                          </MenuItem>
                          <MenuItem onClick={() => handleDelete(payment._id)}>
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Slip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={getPaymentImageUrl(selectedImage)}
              alt="Payment Slip"
              maxW="100%"
              onError={(e) => handleImageError(e, 'Payment Slip')}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminPayments;