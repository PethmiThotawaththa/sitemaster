import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  VStack,
  Image,
  Text,
  Button,
  useToast,
  Heading,
  HStack,
  Input,
  Select,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Skeleton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useProjectStore from '../../store/projectStore';
import useCartStore from '../../store/cartStore';
import useUserStore from '../../store/userStore';
import { getProjectImageUrl, handleImageError } from '../../utils/imageUtils';

const Projects = () => {
  const { projects, fetchProjects, loading: projectsLoading, error: projectsError } = useProjectStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (projects.length === 0 && !projectsLoading) {
      fetchProjects();
    }
  }, [fetchProjects, projects, projectsLoading]);

  const handleExpressInterest = async (projectId) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to express interest',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(projectId, 'Project', 1);
      toast({
        title: 'Success',
        description: 'Interest expressed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to express interest',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProjects();
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter((project) => {
    const matchesSearch = project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (project.category === categoryFilter);
    return matchesSearch && matchesCategory;
  }) : [];

  if (projectsLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (projectsError) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <VStack align="stretch" spacing={2}>
            <Text>{projectsError}</Text>
            <Button colorScheme="blue" onClick={handleRetry}>
              Retry
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  if (!Array.isArray(projects)) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <VStack align="stretch" spacing={2}>
            <Text>Invalid projects data. Please try refreshing the page.</Text>
            <Button colorScheme="blue" onClick={handleRetry}>
              Retry
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Welcome to Our Projects
        </Heading>

        <HStack spacing={4} mb={6}>
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="400px"
          />
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Categories</option>
            <option value="construction">Construction</option>
            <option value="renovation">Renovation</option>
            <option value="maintenance">Maintenance</option>
          </Select>
        </HStack>

        {filteredProjects.length === 0 ? (
          <Text textAlign="center">No projects found</Text>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {filteredProjects.map((project) => {
              const imageUrl = getProjectImageUrl(project.attachments?.[0]);
              return (
                <VStack
                  key={project._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  spacing={3}
                >
                  <Box
                    position="relative"
                    width="100%"
                    height="200px"
                    overflow="hidden"
                    borderRadius="md"
                  >
                    <Skeleton isLoaded={!!imageUrl} height="100%">
                      <Image
                        src={imageUrl}
                        alt={project.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        onError={(e) => handleImageError(e, project.name)}
                        fallback={<Box height="100%" width="100%" bg="gray.100" />}
                      />
                    </Skeleton>
                  </Box>
                  <Text fontSize="xl" fontWeight="bold">
                    {project.name}
                  </Text>
                  <Text>${project.budget?.toFixed(2) || 'N/A'}</Text>
                  <HStack spacing={2} width="full">
                    <Button
                      as={RouterLink}
                      to={`/projects/${project._id}`}
                      colorScheme="blue"
                      width="full"
                      variant="outline"
                    >
                      View Details
                    </Button>
                    <Button
                      colorScheme="blue"
                      width="full"
                      onClick={() => handleExpressInterest(project._id)}
                      isLoading={loading}
                    >
                      Express Interest
                    </Button>
                  </HStack>
                </VStack>
              );
            })}
          </Grid>
        )}
      </VStack>
    </Container>
  );
};

export default Projects;