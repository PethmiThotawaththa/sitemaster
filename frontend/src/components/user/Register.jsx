import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import userService from '../../services/userService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await userService.register(userData);
      
      toast({
        title: 'Registration successful',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Heading textAlign="center">Register for SiteMaster</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Register
            </Button>
          </VStack>
        </form>
        <Text textAlign="center">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="blue.500">
            Login here
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register; 