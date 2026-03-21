import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Card,
  CardBody,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaProjectDiagram,
  FaBoxes,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
} from 'react-icons/fa';

const StatCard = ({ title, value, change, icon, color }) => (
  <Card>
    <CardBody>
      <HStack justify="space-between" align="flex-start">
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
        <Icon as={icon} w={8} h={8} color={color} />
      </HStack>
    </CardBody>
  </Card>
);

const RecentActivity = () => (
  <Card>
    <CardBody>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Recent Activity</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Project</Th>
              <Th>Activity</Th>
              <Th>Status</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Office Building</Td>
              <Td>Material Delivery</Td>
              <Td>
                <Badge colorScheme="green">Completed</Badge>
              </Td>
              <Td>2 hours ago</Td>
            </Tr>
            <Tr>
              <Td>Residential Complex</Td>
              <Td>Progress Report</Td>
              <Td>
                <Badge colorScheme="blue">In Progress</Badge>
              </Td>
              <Td>5 hours ago</Td>
            </Tr>
            <Tr>
              <Td>Shopping Mall</Td>
              <Td>Budget Update</Td>
              <Td>
                <Badge colorScheme="yellow">Pending</Badge>
              </Td>
              <Td>1 day ago</Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </CardBody>
  </Card>
);

const QuickActions = () => (
  <Card>
    <CardBody>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Quick Actions</Heading>
        <SimpleGrid columns={2} spacing={4}>
          <Button
            as={RouterLink}
            to="/projects/new"
            leftIcon={<FaProjectDiagram />}
            colorScheme="blue"
            variant="outline"
          >
            New Project
          </Button>
          <Button
            as={RouterLink}
            to="/inventory/add"
            leftIcon={<FaBoxes />}
            colorScheme="green"
            variant="outline"
          >
            Add Inventory
          </Button>
          <Button
            as={RouterLink}
            to="/financial/transactions"
            leftIcon={<FaMoneyBillWave />}
            colorScheme="purple"
            variant="outline"
          >
            Add Transaction
          </Button>
          <Button
            as={RouterLink}
            to="/calendar"
            leftIcon={<FaCalendarAlt />}
            colorScheme="orange"
            variant="outline"
          >
            View Calendar
          </Button>
        </SimpleGrid>
      </VStack>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg">Dashboard</Heading>
            <Text color="gray.500">Welcome back! Here's what's happening today.</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard
              title="Active Projects"
              value="12"
              change={5}
              icon={FaProjectDiagram}
              color="blue.500"
            />
            <StatCard
              title="Inventory Items"
              value="245"
              change={-2}
              icon={FaBoxes}
              color="green.500"
            />
            <StatCard
              title="Total Budget"
              value="$1.2M"
              change={8}
              icon={FaMoneyBillWave}
              color="purple.500"
            />
            <StatCard
              title="Project Progress"
              value="78%"
              change={3}
              icon={FaChartLine}
              color="orange.500"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <RecentActivity />
            <QuickActions />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 