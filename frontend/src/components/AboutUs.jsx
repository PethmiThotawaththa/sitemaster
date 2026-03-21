import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Container,
  Divider,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaHardHat, FaTools, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            About SiteMaster
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Empowering Construction Excellence
          </Text>
        </Box>

        <Divider />

        {/* Introduction */}
        <Text fontSize="lg" lineHeight="tall">
          At <strong>SiteMaster</strong>, we are dedicated to revolutionizing the way construction projects are managed. Built for contractors, project managers, and construction firms, our platform provides a comprehensive solution to streamline project management, inventory tracking, financial oversight, and team collaboration.
        </Text>

        {/* Mission Statement */}
        <Box bg="gray.50" p={6} borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>
            Our Mission
          </Heading>
          <Text fontSize="md" color="gray.600">
            We aim to empower construction professionals by providing intuitive, powerful tools that simplify complex workflows, reduce inefficiencies, and drive project success. From small renovations to large-scale developments, SiteMaster is your partner in building the future.
          </Text>
        </Box>

        {/* Key Features */}
        <Box>
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Why Choose SiteMaster?
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box textAlign="center" p={4}>
              <Icon as={FaHardHat} w={12} h={12} color="blue.500" mb={4} />
              <Heading as="h3" size="md" mb={2}>
                Project Management
              </Heading>
              <Text color="gray.600">
                Track progress, manage teams, and stay on schedule with our robust project management tools.
              </Text>
            </Box>
            <Box textAlign="center" p={4}>
              <Icon as={FaTools} w={12} h={12} color="blue.500" mb={4} />
              <Heading as="h3" size="md" mb={2}>
                Inventory Tracking
              </Heading>
              <Text color="gray.600">
                Monitor materials, manage stock levels, and ensure you have what you need, when you need it.
              </Text>
            </Box>
            <Box textAlign="center" p={4}>
              <Icon as={FaChartLine} w={12} h={12} color="blue.500" mb={4} />
              <Heading as="h3" size="md" mb={2}>
                Financial Insights
              </Heading>
              <Text color="gray.600">
                Keep your budgets in check with real-time financial tracking and reporting.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Closing Statement */}
        <Text fontSize="lg" textAlign="center" mt={6}>
          Founded in 2025, SiteMaster is committed to supporting the construction industry with innovative solutions. Join thousands of professionals who trust SiteMaster to build smarter, safer, and more efficiently.
        </Text>
      </VStack>
    </Container>
  );
};

export default AboutUs;