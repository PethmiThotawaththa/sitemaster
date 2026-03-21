import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Heading,
  VStack,
  HStack,
  Text,
  Progress,
  Center,
  Spinner,
} from '@chakra-ui/react';
import useInventoryStore from '../../../store/inventoryStore';
import useUserStore from '../../../store/userStore'; // Update to useUserStore
import AdminInventoryList from './AdminInventoryList';

const InventoryStats = ({ inventory }) => {
  const totalItems = inventory?.length || 0;
  const totalValue = inventory?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const lowStockItems = inventory?.filter(item => item.quantity < 10)?.length || 0;

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Total Items</StatLabel>
            <StatNumber>{totalItems}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Low Stock Items</StatLabel>
            <StatNumber>{lowStockItems}</StatNumber>
            <StatHelpText color="yellow.500">Needs attention</StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Out of Stock</StatLabel>
            <StatNumber>{inventory?.filter(item => item.quantity === 0)?.length || 0}</StatNumber>
            <StatHelpText color="red.500">Critical</StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stat>
            <StatLabel>Total Value</StatLabel>
            <StatNumber>${totalValue.toFixed(2)}</StatNumber>
            <StatHelpText>Total value of inventory</StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </Grid>
  );
};

const CategoryBreakdown = ({ inventory }) => {
  const categoryData = inventory?.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Category Breakdown</Heading>
          {Object.keys(categoryData).length === 0 ? (
            <Text>No categories available</Text>
          ) : (
            Object.entries(categoryData).map(([category, count]) => (
              <Box key={category}>
                <HStack justify="space-between" mb={2}>
                  <Text>{category}</Text>
                  <Text>{count} items</Text>
                </HStack>
                <Progress 
                  value={(count / inventory.length) * 100} 
                  colorScheme="blue" 
                  size="sm" 
                  borderRadius="full"
                />
              </Box>
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

const LowStockAlert = ({ inventory }) => {
  const lowStockItems = inventory?.filter(item => item.quantity < 10) || [];

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Low Stock Alerts</Heading>
          {lowStockItems.length === 0 ? (
            <Text>No low stock items</Text>
          ) : (
            lowStockItems.map(item => (
              <HStack key={item._id} justify="space-between">
                <Text>{item.name}</Text>
                <Text color={item.quantity === 0 ? "red.500" : "yellow.500"}>
                  {item.quantity} remaining
                </Text>
              </HStack>
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

const AdminInventoryDashboard = () => {
  const { inventory, loading, error, fetchInventory } = useInventoryStore();
  const { isAuthenticated, isAdmin } = useUserStore(); // Update to useUserStore, use isAdmin

  useEffect(() => {
    console.log('AdminInventoryDashboard: isAuthenticated=', isAuthenticated, 'isAdmin=', isAdmin);
    if (isAuthenticated && isAdmin && !loading && !inventory) {
      console.log('AdminInventoryDashboard: Fetching inventory');
      fetchInventory();
    }
  }, [isAuthenticated, isAdmin, loading, inventory, fetchInventory]);

  console.log('AdminInventoryDashboard: loading=', loading, 'error=', error, 'inventory=', inventory);

  if (!isAuthenticated || !isAdmin) {
    console.log('AdminInventoryDashboard: Not authenticated or not an admin');
    return (
      <Center h="200px">
        <Text>
          {isAuthenticated ? 'Admin access required' : 'Please log in to access this page'}
        </Text>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <InventoryStats inventory={inventory} />
        </GridItem>
        <GridItem>
          <CategoryBreakdown inventory={inventory} />
        </GridItem>
        <GridItem>
          <LowStockAlert inventory={inventory} />
        </GridItem>
      </Grid>
      <AdminInventoryList inventory={inventory} />
    </VStack>
  );
};

export default AdminInventoryDashboard;