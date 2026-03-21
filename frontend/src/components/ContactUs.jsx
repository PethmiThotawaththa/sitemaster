import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Container,
  Divider,
  Stack,
  Icon,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Corrected imports

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for backend submission (e.g., via axiosInstance)
    toast({
      title: 'Message Sent',
      description: 'Our team will get back to you soon!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Contact SiteMaster
          </Heading>
          <Text fontSize="lg" color="gray.600">
            We’re Here to Support Your Construction Needs
          </Text>
        </Box>

        <Divider />

        {/* Contact Information */}
        <Stack spacing={6} align="center">
          <Box display="flex" alignItems="center">
            <Icon as={FaEnvelope} w={6} h={6} mr={2} color="blue.500" />
            <Text fontSize="lg">
              Email:{' '}
              <a href="mailto:support@sitemaster.com">support@sitemaster.com</a>
            </Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Icon as={FaPhone} w={6} h={6} mr={2} color="blue.500" />
            <Text fontSize="lg">
              Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
            </Text>
          </Box>
          <Box display="flex" alignItems="center">
            <Icon as={FaMapMarkerAlt} w={6} h={6} mr={2} color="blue.500" />
            <Text fontSize="lg">
              Address: 123 Construction Lane, Build City, BC 12345
            </Text>
          </Box>
        </Stack>

        <Divider />

        {/* Contact Form */}
        <Box>
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Get in Touch
          </Heading>
          <Box maxW="500px" mx="auto">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist you with your construction project?"
                    rows={5}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">
                  Send Message
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>

        {/* Closing Statement */}
        <Text fontSize="lg" textAlign="center" mt={6}>
          Whether you have questions about managing your projects, inventory, or financials, the SiteMaster team is here to help. Reach out today!
        </Text>
      </VStack>
    </Container>
  );
};

export default ContactUs;