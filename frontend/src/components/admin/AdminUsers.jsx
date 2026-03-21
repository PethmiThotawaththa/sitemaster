import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useToast,
  Badge,
  HStack,
  VStack,
  Heading,
  Text,
  Spinner,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore.js';
import useAdminUserStore from '../../store/adminUserStore.js';

const AdminUsers = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated, isAdmin } = useUserStore();
  const { users, loading, error, fetchUsers, deleteUser } = useAdminUserStore();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, fetchUsers]);

  useEffect(() => {
    console.log('AdminUsers: Users array loaded:', users);
    setFilteredUsers(users);
  }, [users]);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    if (userId === user._id) {
      toast({
        title: 'Error',
        description: 'You cannot delete your own account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast({
          title: 'User deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error deleting user',
          description: error.message || 'Failed to delete user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <Box p={6} textAlign="center">
        <Text color="red.500">
          {isAuthenticated ? 'Admin access required' : 'Please log in to access this page'}
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="lg" />
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
          <Heading size="lg">User Management</Heading>
          <Text color="gray.500">Manage system users and their roles</Text>
        </Box>

        <HStack spacing={4}>
          <FormControl maxW="300px">
            <FormLabel>Search Users</FormLabel>
            <Input
              placeholder="Search by name, email, or role"
              value={searchQuery}
              onChange={handleSearch}
            />
          </FormControl>
        </HStack>

        {filteredUsers.length === 0 ? (
          <Text textAlign="center">No users found</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        user.role === 'admin'
                          ? 'red'
                          : user.role === 'supplier'
                          ? 'green'
                          : user.role === 'customer'
                          ? 'orange'
                          : 'blue'
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={user.status === 'active' ? 'green' : 'red'}
                    >
                      {user.status || 'active'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit user"
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete user"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(user._id)}
                      />
                    </HStack>
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

export default AdminUsers;