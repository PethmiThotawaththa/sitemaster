import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
    >
      <Container maxW="container.md" textAlign="center">
        <VStack spacing={6}>
          <Heading
            fontSize={{ base: '6xl', md: '8xl' }}
            fontWeight="bold"
            color="blue.500"
          >
            404
          </Heading>
          <Heading size="lg">Page Not Found</Heading>
          <Text fontSize="xl" color={textColor}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<FaHome />}
            colorScheme="blue"
            size="lg"
            mt={4}
          >
            Back to Home
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound; 