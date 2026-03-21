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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import userService from '../../services/userService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser, setToken, setAuthenticated, setAdmin } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userService.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      setAuthenticated(true);
      setAdmin(response.user.role === 'admin');
      
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
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
        <Heading textAlign="center">Login to SiteMaster</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
        <Text textAlign="center">
          Don't have an account?{' '}
          <Link as={RouterLink} to="/register" color="blue.500">
            Register here
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login; 