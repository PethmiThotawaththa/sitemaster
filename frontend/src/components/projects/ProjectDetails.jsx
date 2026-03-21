import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  Badge,
  useToast,
  useColorModeValue,
  Image,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios'; // Update to use axiosInstance
import useUserStore from '../../store/userStore';
import { getProjectImageUrl, handleImageError } from '../../utils/imageUtils';

const CalculateExpenseInterestButton = ({ projectId, onInterestCalculated }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState(null);

  const handleCalculateInterest = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/projects/${projectId}/calculate-expense-interest`, {});
      setInterest(response.data.interest);
      onInterestCalculated(); // Refresh project data
      toast({
        title: 'Success',
        description: `Expense interest calculated: $${response.data.interest.toFixed(2)}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to calculate expense interest',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={2}>
      <Button
        onClick={handleCalculateInterest}
        isLoading={loading}
        colorScheme="blue"
        isDisabled={interest !== null}
      >
        Calculate Expense Interest
      </Button>
      {interest !== null && (
        <Text color="green.500">
          Calculated Interest: ${interest.toFixed(2)}
        </Text>
      )}
    </VStack>
  );
};

const UpdateExpensesForm = ({ projectId, onExpensesUpdated }) => {
  const [expenses, setExpenses] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleUpdateExpenses = async () => {
    if (!expenses || isNaN(expenses) || Number(expenses) < 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid expense amount',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(`/api/projects/${projectId}`, { expenses: Number(expenses) });
      onExpensesUpdated(); // Refresh project data
      setExpenses('');
      toast({
        title: 'Success',
        description: 'Expenses updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update expenses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={2}>
      <FormControl>
        <FormLabel>Update Expenses</FormLabel>
        <HStack>
          <Input
            type="number"
            placeholder="Enter expenses amount"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
          />
          <Button
            onClick={handleUpdateExpenses}
            isLoading={loading}
            colorScheme="green"
          >
            Update
          </Button>
        </HStack>
      </FormControl>
    </VStack>
  );
};

const ProjectDetails = () => {
  const { id } = useParams(); // Get project ID from URL
  const { user, isAuthenticated } = useUserStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch project details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id, toast]);

  const handleExpressInterest = async () => {
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
      const response = await axiosInstance.post(`/api/cart/add`, {
        itemId: id,
        itemType: 'Project',
        quantity: 1,
      });
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

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!project) {
    return <Box>Project not found.</Box>;
  }

  const imageUrl = getProjectImageUrl(project.attachments?.[0]);

  return (
    <Box bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg">{project.name}</Heading>
            <Text color="gray.500">Project Details</Text>
          </Box>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {imageUrl && (
                  <Box
                    position="relative"
                    width="100%"
                    height="300px"
                    overflow="hidden"
                    borderRadius="md"
                  >
                    <Image
                      src={imageUrl}
                      alt={project.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      onError={(e) => handleImageError(e, project.name)}
                      fallback={<Box height="100%" width="100%" bg="gray.100" />}
                    />
                  </Box>
                )}
                <HStack justify="space-between">
                  <Text fontWeight="bold">Description:</Text>
                  <Text>{project.description}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Status:</Text>
                  <Badge
                    colorScheme={
                      project.status === 'completed'
                        ? 'green'
                        : project.status === 'in_progress'
                        ? 'blue'
                        : project.status === 'pending'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {project.status.replace('_', ' ')}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Start Date:</Text>
                  <Text>{new Date(project.startDate).toLocaleDateString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">End Date:</Text>
                  <Text>{new Date(project.endDate).toLocaleDateString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Client:</Text>
                  <Text>{project.clientName} ({project.clientEmail})</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Budget:</Text>
                  <Text>${project.budget.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Expenses:</Text>
                  <Text>${project.expenses.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Expense Interest:</Text>
                  <Text>${project.expenseInterest.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Interest Rate:</Text>
                  <Text>{(project.interestRate * 100).toFixed(1)}% per year</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Team Members:</Text>
                  <Text>
                    {project.teamMembers.map(member => member.name).join(', ') || 'None'}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Created By:</Text>
                  <Text>{project.createdBy.name} ({project.createdBy.email})</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Actions</Heading>
                <Button
                  colorScheme="blue"
                  onClick={handleExpressInterest}
                  isLoading={loading}
                >
                  Express Interest
                </Button>
                {user?.role === 'admin' && (
                  <>
                    <UpdateExpensesForm projectId={id} onExpensesUpdated={fetchProject} />
                    <CalculateExpenseInterestButton projectId={id} onInterestCalculated={fetchProject} />
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProjectDetails;