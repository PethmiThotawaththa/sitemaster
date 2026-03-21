import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Flex,
  Input,
  Select,
  Text,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import useUserStore from '../../stores/userStore';
import userService from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const { token } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers(token);
      setUsers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await userService.updateUserStatus(updatedUser._id, updatedUser.status, token);
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      toast({
        title: 'Success',
        description: 'User updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Box p={6}>
      <Flex mb={6} gap={4}>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          maxW="300px"
        />
        <Select
          value={roleFilter}
          onChange={handleRoleFilter}
          maxW="200px"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </Select>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
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
              <Td>{user.phone}</Td>
              <Td>
                <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>
                  {user.role}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
                  {user.status}
                </Badge>
              </Td>
              <Td>
                <IconButton
                  icon={<EditIcon />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => handleEditUser(user)}
                  mr={2}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleUpdateUser({ ...user, status: 'inactive' })}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <Box>
                <Text mb={2}>Name: {selectedUser.name}</Text>
                <Text mb={2}>Email: {selectedUser.email}</Text>
                <Text mb={2}>Role: {selectedUser.role}</Text>
                <Select
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleUpdateUser(selectedUser)}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement; 