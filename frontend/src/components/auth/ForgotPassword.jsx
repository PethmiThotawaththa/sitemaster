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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useUserStore from '../../store/userStore';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { forgotPassword } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      toast({
        title: 'Reset Email Sent',
        description: 'Please check your email for password reset instructions.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset email',
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
          <Heading>Forgot Password</Heading>
          <Text mt={2} color="gray.600">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
              loadingText="Sending..."
            >
              Send Reset Instructions
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

export default ForgotPassword; 