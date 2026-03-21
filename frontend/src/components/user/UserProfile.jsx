import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Avatar,
  AvatarBadge,
  Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EditIcon } from '@chakra-ui/icons';
import useUserStore from '../../stores/userStore';
import userService from '../../services/userService';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user, token } = useUserStore();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { confirmNewPassword, ...updateData } = formData;
      await userService.updateProfile(updateData, token);
      
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Avatar size="xl" src={user?.avatar}>
            <AvatarBadge
              boxSize="1.25em"
              bg="green.500"
              borderColor="white"
              borderWidth="2px"
            >
              <Icon as={EditIcon} boxSize="0.75em" color="white" />
            </AvatarBadge>
          </Avatar>
          <Heading size="md" mt={4}>
            {user?.name}
          </Heading>
          <Text color="gray.500">{user?.email}</Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Update Profile
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default UserProfile; 