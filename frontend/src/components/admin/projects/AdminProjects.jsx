import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  Select,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // Add this import
import { AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons'; // Add ViewIcon
import useProjectStore from '../../../store/projectStore';

const AdminProjects = () => {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  } = useProjectStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    clientName: '',
    clientEmail: '',
    budget: 0,
    teamMembers: [],
    attachments: [],
  });

  const toast = useToast();

  useEffect(() => {
    fetchProjects().catch((err) => {
      toast({
        title: 'Error fetching projects',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }, [fetchProjects, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'attachments') {
          formDataToSend.append(key, 
            typeof formData[key] === 'object' 
              ? JSON.stringify(formData[key]) 
              : formData[key]
          );
        }
      });
      
      // Append files
      if (formData.attachments) {
        Array.from(formData.attachments).forEach(file => {
          formDataToSend.append('attachments', file);
        });
      }

      if (selectedProject) {
        await updateProject(selectedProject._id, formDataToSend);
        toast({
          title: 'Success',
          description: 'Project updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addProject(formDataToSend);
        toast({
          title: 'Success',
          description: 'Project added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      resetForm();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      clientName: '',
      clientEmail: '',
      budget: 0,
      teamMembers: [],
      attachments: [],
    });
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
      status: project.status,
      clientName: project.clientName,
      clientEmail: project.clientEmail,
      budget: project.budget,
      teamMembers: project.teamMembers,
      attachments: project.attachments,
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast({
          title: 'Success',
          description: 'Project deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="300px"
            />
          </Box>
          <HStack>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              width="200px"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Button
              leftIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                onOpen();
              }}
              colorScheme="blue"
            >
              Add Project
            </Button>
          </HStack>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Client</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Status</Th>
              <Th>Budget</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProjects.map((project) => (
              <Tr key={project._id}>
                <Td>{project.name}</Td>
                <Td>{project.clientName}</Td>
                <Td>{new Date(project.startDate).toLocaleDateString()}</Td>
                <Td>{new Date(project.endDate).toLocaleDateString()}</Td>
                <Td>
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
                </Td>
                <Td>${project.budget.toLocaleString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      as={RouterLink}
                      to={`/projects/${project._id}`}
                      icon={<ViewIcon />}
                      colorScheme="blue"
                      size="sm"
                      aria-label="View project details"
                    />
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleEdit(project)}
                      colorScheme="blue"
                      size="sm"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(project._id)}
                      colorScheme="red"
                      size="sm"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedProject ? 'Edit Project' : 'Add New Project'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Project Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </FormControl>

                  <HStack width="100%" spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Start Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>End Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </FormControl>
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </FormControl>

                  <HStack width="100%" spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Client Name</FormLabel>
                      <Input
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({ ...formData, clientName: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Client Email</FormLabel>
                      <Input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, clientEmail: e.target.value })
                        }
                      />
                    </FormControl>
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel>Budget</FormLabel>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: parseFloat(e.target.value) })
                      }
                      min={0}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Attachments</FormLabel>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setFormData({ ...formData, attachments: e.target.files })
                      }
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" width="full">
                    {selectedProject ? 'Update Project' : 'Add Project'}
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default AdminProjects;