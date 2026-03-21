import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Select,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useUserStore from '../../store/userStore';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    companyType: 'construction', // Default value from enum
    address: '',
    role: 'manager', // Default value from enum
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { registerAdmin } = useUserStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await registerAdmin(userData);
      toast({
        title: 'Registration successful',
        description: 'New user has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        companyName: '',
        companyType: 'construction',
        address: '',
        role: 'manager',
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Failed to create user',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Create New User</Heading>
          <Text mt={2} color="gray.600">
            Add a new manager or admin to the system
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                pattern="[0-9]{10}"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="supplier">Supplier</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Company Name</FormLabel>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Company Type</FormLabel>
              <Select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
              >
                <option value="construction">Construction</option>
                <option value="supplier">Supplier</option>
                <option value="contractor">Contractor</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  minLength={6}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                minLength={6}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Create User
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default AdminRegister; 