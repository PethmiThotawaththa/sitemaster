import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  useToast,
  Divider,
  useColorMode,
} from '@chakra-ui/react';
import {
  FaBell,
  FaLock,
  FaLanguage,
  FaPalette,
  FaSave,
} from 'react-icons/fa';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Mock data - replace with actual user settings
  const settings = {
    notifications: {
      email: true,
      push: false,
      projectUpdates: true,
      inventoryAlerts: true,
    },
    language: 'en',
    theme: colorMode,
  };

  const handleSave = () => {
    setIsSaving(true);
    // Add actual save functionality
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1000);
  };

  return (
    <Box py={8}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Notification Settings</Heading>
                  <FaBell />
                </HStack>

                <Divider />

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Email Notifications</FormLabel>
                  <Switch
                    isChecked={settings.notifications.email}
                    onChange={() => {}}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Push Notifications</FormLabel>
                  <Switch
                    isChecked={settings.notifications.push}
                    onChange={() => {}}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Project Updates</FormLabel>
                  <Switch
                    isChecked={settings.notifications.projectUpdates}
                    onChange={() => {}}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Inventory Alerts</FormLabel>
                  <Switch
                    isChecked={settings.notifications.inventoryAlerts}
                    onChange={() => {}}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Security Settings</Heading>
                  <FaLock />
                </HStack>

                <Divider />

                <FormControl>
                  <FormLabel>Change Password</FormLabel>
                  <Input type="password" placeholder="Current password" />
                </FormControl>

                <FormControl>
                  <Input type="password" placeholder="New password" />
                </FormControl>

                <FormControl>
                  <Input type="password" placeholder="Confirm new password" />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Appearance</Heading>
                  <FaPalette />
                </HStack>

                <Divider />

                <FormControl>
                  <FormLabel>Language</FormLabel>
                  <Select value={settings.language} onChange={() => {}}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Dark Mode</FormLabel>
                  <Switch
                    isChecked={settings.theme === 'dark'}
                    onChange={toggleColorMode}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Button
            leftIcon={<FaSave />}
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving..."
          >
            Save Changes
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Settings; 