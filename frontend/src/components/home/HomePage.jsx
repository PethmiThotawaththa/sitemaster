import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Image,
  Flex,
  IconButton,
  VStack,
  SimpleGrid,
  Icon,
  useToast,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

// Import local images
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide2.jpg';
import slide3 from '../../assets/images/slide3.webp';

const slides = [
  {
    image: slide1,
    title: 'Welcome to SiteMaster',
    description: 'Your all-in-one construction management solution',
  },
  {
    image: slide2,
    title: 'Project Management',
    description: 'Efficiently manage your construction projects',
  },
  {
    image: slide3,
    title: 'Inventory Control',
    description: 'Keep track of your materials and equipment',
  },
];

const features = [
  {
    title: 'Project Management',
    description: 'Track and manage all your construction projects in one place',
    icon: '📋',
  },
  {
    title: 'Inventory Control',
    description: 'Monitor materials and equipment with real-time updates',
    icon: '📦',
  },
  {
    title: 'Team Collaboration',
    description: 'Connect with your team and stakeholders seamlessly',
    icon: '👥',
  },
  {
    title: 'Financial Tracking',
    description: 'Monitor budgets and expenses with detailed reports',
    icon: '💰',
  },
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
    toast({
      title: 'Image Error',
      description: 'Failed to load image',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {/* Hero Slider */}
      <Box position="relative" height="400px" overflow="hidden">
        {slides.map((slide, index) => (
          <Box
            key={index}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            opacity={currentSlide === index ? 1 : 0}
            transition="opacity 0.5s ease-in-out"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              width="100%"
              height="100%"
              objectFit="cover"
              onError={handleImageError}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="rgba(0,0,0,0.5)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              color="white"
              textAlign="center"
              p={4}
            >
              <Heading size="2xl" mb={4}>
                {slide.title}
              </Heading>
              <Text fontSize="xl" maxW="600px">
                {slide.description}
              </Text>
            </Box>
          </Box>
        ))}

        <IconButton
          icon={<ChevronLeftIcon />}
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
          }
          aria-label="Previous slide"
        />
        <IconButton
          icon={<ChevronRightIcon />}
          position="absolute"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
        />
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <Heading textAlign="center" mb={12}>
          Key Features
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={8}>
          {features.map((feature, index) => (
            <GridItem
              key={index}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s' }}
            >
              <Flex direction="column" align="center" textAlign="center">
                <Text fontSize="4xl" mb={4}>
                  {feature.icon}
                </Text>
                <Heading size="md" mb={2}>
                  {feature.title}
                </Heading>
                <Text color="gray.600">{feature.description}</Text>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box bg="blue.50" py={16}>
        <Container maxW="container.md" textAlign="center">
          <Heading mb={4}>Ready to Get Started?</Heading>
          <Text fontSize="xl" mb={8}>
            Join thousands of construction professionals who trust SiteMaster for their project management needs.
          </Text>
          <Button
            as={RouterLink}
            to="/register"
            colorScheme="blue"
            size="lg"
            px={8}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 