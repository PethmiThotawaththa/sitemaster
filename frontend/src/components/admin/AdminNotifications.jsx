import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  Badge,
  IconButton,
  HStack,
  useToast,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import axiosInstance from '../../utils/axiosConfig';
import useUserStore from '../../store/userStore'; // Update to useUserStore

const AdminNotifications = () => {
  const { isAuthenticated, isAdmin } = useUserStore(); // Update to useUserStore, use isAdmin
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/admin/notifications');
        setNotifications(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching notifications',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchNotifications();
    }
  }, [isAuthenticated, isAdmin]);

  const markAsRead = async (id) => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Admin access required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axiosInstance.put(`/api/admin/notifications/${id}/read`);
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      toast({
        title: 'Error marking notification as read',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteNotification = async (id) => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Admin access required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axiosInstance.delete(`/api/admin/notifications/${id}`);
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (error) {
      toast({
        title: 'Error deleting notification',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const markAllAsRead = async () => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Admin access required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axiosInstance.put('/api/admin/notifications/read-all');
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      toast({
        title: 'All notifications marked as read',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error marking all as read',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // PrivateRoute will handle the redirect
  }

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Notifications</Heading>
            <Text color="gray.500">System notifications and alerts</Text>
          </Box>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={markAllAsRead}
            isDisabled={notifications.length === 0 || notifications.every(notif => notif.read)}
          >
            Mark All as Read
          </Button>
        </HStack>

        {notifications.length === 0 ? (
          <Text textAlign="center">No notifications available</Text>
        ) : (
          <List spacing={3}>
            {notifications.map((notification) => (
              <ListItem
                key={notification._id}
                p={4}
                bg={notification.read ? 'white' : 'blue.50'}
                borderRadius="md"
                borderWidth="1px"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontWeight="bold">{notification.title}</Text>
                      <Badge
                        colorScheme={
                          notification.type === 'alert'
                            ? 'red'
                            : notification.type === 'warning'
                            ? 'yellow'
                            : 'green'
                        }
                      >
                        {notification.type}
                      </Badge>
                    </HStack>
                    <Text color="gray.600">{notification.message}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </VStack>
                  <HStack>
                    {!notification.read && (
                      <IconButton
                        icon={<CheckIcon />}
                        size="sm"
                        colorScheme="green"
                        onClick={() => markAsRead(notification._id)}
                        aria-label="Mark as read"
                      />
                    )}
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => deleteNotification(notification._id)}
                      aria-label="Delete notification"
                    />
                  </HStack>
                </HStack>
              </ListItem>
            ))}
          </List>
        )}
      </VStack>
    </Box>
  );
};

export default AdminNotifications;