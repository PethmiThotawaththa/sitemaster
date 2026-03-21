import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaUsers,
  FaProjectDiagram,
  FaChartLine,
  FaCog,
  FaUserPlus,
  FaBoxes,
} from 'react-icons/fa';
import AdminLayout from './AdminLayout';

const StatCard = ({ title, value, change, icon, color }) => (
  <Card>
    <CardBody>
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text color="gray.500" fontSize="sm">
            {title}
          </Text>
          <Stat>
            <StatNumber>{value}</StatNumber>
            {change && (
              <StatHelpText>
                <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
                {Math.abs(change)}%
              </StatHelpText>
            )}
          </Stat>
        </VStack>
        <Box color={color} fontSize="2xl">
          {icon}
        </Box>
      </HStack>
    </CardBody>
  </Card>
);

const RecentActivities = () => (
  <Card>
    <CardBody>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Recent Activities</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Action</Th>
              <Th>Time</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Add your recent activities data here */}
            <Tr>
              <Td>John Doe</Td>
              <Td>Created new project</Td>
              <Td>5 mins ago</Td>
              <Td>
                <Badge colorScheme="green">Success</Badge>
              </Td>
            </Tr>
            {/* Add more rows as needed */}
          </Tbody>
        </Table>
      </VStack>
    </CardBody>
  </Card>
);

const AdminDashboard = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  // Mock data - replace with actual API calls
  const adminData = {
    totalUsers: 45,
    activeProjects: 12,
    systemHealth: 'Good',
    recentActivities: [
      {
        id: 1,
        user: 'John Doe',
        action: 'Created new project',
        timestamp: '2024-03-15 10:30',
        status: 'success',
      },
      {
        id: 2,
        user: 'Jane Smith',
        action: 'Updated user permissions',
        timestamp: '2024-03-15 09:15',
        status: 'success',
      },
      {
        id: 3,
        user: 'Mike Johnson',
        action: 'Deleted project',
        timestamp: '2024-03-14 16:45',
        status: 'warning',
      },
    ],
  };

  return (
    <AdminLayout>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text color="gray.500">Welcome to the admin control panel</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard
            title="Total Users"
            value={adminData.totalUsers}
            change={8}
            icon={<FaUsers />}
            color="blue.500"
          />
          <StatCard
            title="Active Projects"
            value={adminData.activeProjects}
            change={5}
            icon={<FaProjectDiagram />}
            color="green.500"
          />
          <StatCard
            title="Inventory Items"
            value="789"
            change={-3}
            icon={<FaBoxes />}
            color="purple.500"
          />
          <StatCard
            title="System Health"
            value={adminData.systemHealth}
            icon={<FaChartLine />}
            color="orange.500"
          />
        </SimpleGrid>

        <RecentActivities />
      </VStack>
    </AdminLayout>
  );
};

export default AdminDashboard; 