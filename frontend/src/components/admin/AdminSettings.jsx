import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '../../utils/axiosConfig';
import useUserStore from '../../store/userStore'; // Update to useUserStore

const AdminSettings = () => {
  const { user, isAuthenticated, isAdmin } = useUserStore(); // Update to use isAdmin
  const [settings, setSettings] = useState({
    siteName: 'SiteMaster',
    emailNotifications: true,
    autoReorder: true,
    lowStockThreshold: 10,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/admin/settings');
        setSettings(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching settings',
          description: error.response?.data?.message || 'Failed to fetch settings',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchSettings();
    }
  }, [isAuthenticated, isAdmin]);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = async () => {
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

    setLoading(true);
    try {
      await axiosInstance.put('/api/admin/settings', settings);
      toast({
        title: 'Settings saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // PrivateRoute will handle the redirect
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">System Settings</Heading>
          <Text color="gray.500">Configure system-wide settings</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">General Settings</Heading>
                <FormControl>
                  <FormLabel>Site Name</FormLabel>
                  <Input
                    value={settings.siteName || ''}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Email Notifications</FormLabel>
                  <Switch
                    isChecked={settings.emailNotifications}
                    onChange={(e) =>
                      handleChange('emailNotifications', e.target.checked)
                    }
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Maintenance Mode</FormLabel>
                  <Switch
                    isChecked={settings.maintenanceMode}
                    onChange={(e) =>
                      handleChange('maintenanceMode', e.target.checked)
                    }
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Inventory Settings</Heading>
                <FormControl>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <Input
                    type="number"
                    value={settings.lowStockThreshold || 0}
                    onChange={(e) =>
                      handleChange('lowStockThreshold', parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Auto Reorder</FormLabel>
                  <Switch
                    isChecked={settings.autoReorder}
                    onChange={(e) => handleChange('autoReorder', e.target.checked)}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Box>
          <Button
            colorScheme="blue"
            onClick={saveSettings}
            isLoading={loading}
          >
            Save Settings
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminSettings;