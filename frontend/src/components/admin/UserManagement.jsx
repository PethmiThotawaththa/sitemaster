import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Avatar,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaSearch,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserShield,
  FaUser,
} from 'react-icons/fa';

const UserRoleBadge = ({ role }) => {
  const colorSchemes = {
    admin: 'purple',
    manager: 'blue',
    user: 'green',
  };

  return (
    <Badge colorScheme={colorSchemes[role] || 'gray'}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const toast = useToast();

  // Mock data - replace with actual API calls
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-15 10:30',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-03-14 15:45',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-03-10 09:20',
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (userId) => {
    // Add actual delete functionality
    toast({
      title: 'User deleted',
      description: 'The user has been successfully deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Heading size="lg">User Management</Heading>
              <Text color="gray.500">
                Manage system users and their permissions
              </Text>
            </Box>
            <Button
              as={RouterLink}
              to="/admin/users/new"
              leftIcon={<FaPlus />}
              colorScheme="blue"
            >
              Add User
            </Button>
          </HStack>

          <Card>
            <CardBody>
              <HStack spacing={4} mb={6}>
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftElement={<FaSearch />}
                />
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  maxW="200px"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </Select>
              </HStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Last Login</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>
                        <HStack>
                          <Avatar
                            name={user.name}
                            size="sm"
                            bg={user.role === 'admin' ? 'purple.500' : 'blue.500'}
                          />
                          <Text fontWeight="medium">{user.name}</Text>
                        </HStack>
                      </Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <UserRoleBadge role={user.role} />
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={user.status === 'active' ? 'green' : 'red'}
                        >
                          {user.status}
                        </Badge>
                      </Td>
                      <Td>{user.lastLogin}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FaEllipsisV />}
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<FaEye />}
                              as={RouterLink}
                              to={`/admin/users/${user.id}`}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem
                              icon={<FaEdit />}
                              as={RouterLink}
                              to={`/admin/users/${user.id}/edit`}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<FaUserShield />}
                              as={RouterLink}
                              to={`/admin/users/${user.id}/permissions`}
                            >
                              Manage Permissions
                            </MenuItem>
                            <MenuItem
                              icon={<FaTrash />}
                              color="red.500"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default UserManagement; 