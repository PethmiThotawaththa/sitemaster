import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore.js';
import useAdminUserStore from '../../store/adminUserStore.js';
import userService from '../../services/userService';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user: authUser, isAuthenticated, isAdmin } = useUserStore();
  const { users, updateUser } = useAdminUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('EditUser: Component mounted with ID:', id);
    console.log('EditUser: isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin);
    console.log('EditUser: Users array from store:', users);

    if (!id) {
      console.log('EditUser: No ID provided in URL');
      setError('Invalid user ID');
      return;
    }

    if (!isAuthenticated || !isAdmin) {
      console.log('EditUser: Early return due to lack of authentication or admin access');
      return;
    }

    const userToEdit = users.find((user) => user._id === id);
    if (userToEdit) {
      console.log('EditUser: User found in store:', userToEdit);
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.role || '',
        status: userToEdit.status || 'active',
      });
    } else {
      console.log('EditUser: User not found in store, fetching from API...');
      const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          console.log('EditUser: Fetching user with ID:', id, 'Token:', token);

          // Add a timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 10000);
          });

          const fetchPromise = userService.getUserById(id, token);
          const userData = await Promise.race([fetchPromise, timeoutPromise]);

          console.log('EditUser: Fetched user data:', userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || '',
            status: userData.status || 'active',
          });
        } catch (err) {
          console.error('EditUser: Error fetching user:', err);
          let errorMessage = 'Failed to load user data';
          if (err.message.includes('404')) {
            errorMessage = 'User not found';
          } else if (err.message.includes('401')) {
            errorMessage = 'Not authorized - please log in again';
          } else if (err.message.includes('timed out')) {
            errorMessage = 'Request timed out - please try again later';
          }
          setError(errorMessage);
          toast({
            title: 'Error',
            description: errorMessage,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, users, toast, isAuthenticated, isAdmin]);

  console.log('EditUser: Current state - loading:', loading, 'error:', error, 'formData:', formData);

  if (!isAuthenticated) {
    console.log('EditUser: Redirecting to login - not authenticated');
    navigate('/login');
    return null;
  }

  if (!isAdmin) {
    console.log('EditUser: Access denied - not an admin');
    return (
      <Box py={8} textAlign="center">
        <Text color="red.500">Admin access required</Text>
        <Button mt={4} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box py={8} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Loading user data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={8} textAlign="center">
        <Text color="red.500">Error: {error}</Text>
        <Button mt={4} onClick={() => navigate('/admin/users')}>
          Back to Users
        </Button>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('EditUser: Submitting updated user data:', formData);
    try {
      await updateUser(id, formData);
      toast({
        title: 'User updated',
        description: 'The user has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin/users');
    } catch (err) {
      console.error('EditUser: Error updating user:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update user',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Edit User</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Select>
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Update User
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default EditUser;