import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardBody,
  useToast,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FaUser, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import useUserStore from '../../store/userStore'; // Update to useUserStore

const Profile = () => {
  const { user, isAuthenticated, getProfile, updateProfile } = useUserStore(); // Update to useUserStore
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        await getProfile(); // This updates the user state in useUserStore
        // Since getProfile updates the store, we rely on the user state
        setFormData(prev => ({
          ...prev,
          name: user?.name || '',
          email: user?.email || '',
          companyName: user?.companyName || '',
          phone: user?.phone || '',
          address: user?.address || '',
        }));
      } catch (err) {
        setError(err.message || 'Failed to fetch profile data');
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch profile data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [getProfile, user, isAuthenticated, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
        companyName: formData.companyName,
        phone: formData.phone,
        address: formData.address,
      };

      await updateProfile(updateData);

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      toast({
        title: 'Error',
        description: err.message || 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Redirect handled by PrivateRoute
  }

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading profile data...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Text color="red.500">Error: {error}</Text>
        <Button mt={4} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box py={8}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Card>
            <CardBody>
              <VStack spacing={6}>
                <Avatar
                  size="2xl"
                  name={user?.name}
                  src={user?.avatar}
                  bg="blue.500"
                />
                <Heading size="lg">{user?.name}</Heading>
                <Badge colorScheme="blue" fontSize="md">
                  {user?.role}
                </Badge>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Personal Information</Heading>
                  <Button
                    colorScheme={isEditing ? 'green' : 'blue'}
                    onClick={() => (isEditing ? handleSubmit({ preventDefault: () => {} }) : setIsEditing(true))}
                    isDisabled={loading}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </HStack>

                <Divider />

                <Box w="100%" as="form" onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <FaUser />
                          <Text>Full Name</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        isDisabled={!isEditing}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <FaEnvelope />
                          <Text>Email</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="email"
                        value={formData.email}
                        isDisabled={true}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <FaBuilding />
                          <Text>Company Name</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        isDisabled={!isEditing}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <FaPhone />
                          <Text>Phone</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        isDisabled={!isEditing}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <FaMapMarkerAlt />
                          <Text>Address</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="address"
                        value={formData.address}
                        isDisabled={!isEditing}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>New Password (leave blank to keep current)</FormLabel>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        isDisabled={!isEditing}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Confirm New Password</FormLabel>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        isDisabled={!isEditing}
                        onChange={handleChange}
                      />
                    </FormControl>

                    {isEditing && (
                      <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        isLoading={loading}
                      >
                        Update Profile
                      </Button>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;