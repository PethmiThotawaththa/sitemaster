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
  Link as ChakraLink,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useUserStore from '../../store/userStore';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPassword } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
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
      await resetPassword(token, password);
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset. Please login with your new password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
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
          <Heading>Reset Your Password</Heading>
          <Text mt={2} color="gray.600">
            Enter your new password below
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
              loadingText="Resetting password..."
            >
              Reset Password
            </Button>
          </VStack>
        </form>

        <Box textAlign="center">
          <Text>
            Remember your password?{' '}
            <ChakraLink as={RouterLink} to="/login" color="blue.500">
              Sign in
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default ResetPassword; 