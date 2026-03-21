import React from 'react';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <AdminSidebar />
      <Box ml={64} pt="60px"> {/* Adjust based on your navbar height */}
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout; 