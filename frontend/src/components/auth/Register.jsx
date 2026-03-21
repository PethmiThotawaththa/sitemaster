import React, { useState, useEffect } from 'react';
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
  Link as ChakraLink,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useUserStore from '../../store/userStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    companyType: 'construction', // Default value
    address: '',
    role: 'customer' // Default value
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
      await register(userData);
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Failed to create account',
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
          <Heading>Create an Account</Heading>
          <Text mt={2} color="gray.600">
            Join us to manage your construction projects efficiently
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
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Company Name</FormLabel>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
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
                placeholder="Enter your address"
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
              loadingText="Creating account..."
            >
              Register
            </Button>
          </VStack>
        </form>

        <Text textAlign="center">
          Already have an account?{' '}
          <ChakraLink as={RouterLink} to="/login" color="blue.500">
            Sign in
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register; 