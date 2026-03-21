import React, { useState, useEffect } from 'react';
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
  FaMoneyBillWave,
  FaChartLine,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import axios from 'axios';

const FinancialCard = ({ title, value, change, icon, color }) => (
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

const Financial = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const [financialData, setFinancialData] = useState({
    totalBudget: '$0',
    spent: '$0',
    remaining: '$0',
    expenseInterest: '$0',
    budgetUtilization: '0%',
    expenses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/financial', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFinancialData(response.data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Heading size="lg">Financial Overview</Heading>
              <Text color="gray.500">
                Track your project budgets and expenses
              </Text>
            </Box>
            <Button
              as={RouterLink}
              to="/financial/transactions/new"
              leftIcon={<FaPlus />}
              colorScheme="blue"
            >
              Add Transaction
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <FinancialCard
              title="Total Budget"
              value={financialData.totalBudget}
              change={5} // Placeholder; calculate dynamically if needed
              icon={<FaMoneyBillWave />}
              color="blue.500"
            />
            <FinancialCard
              title="Amount Spent"
              value={financialData.spent}
              change={-2} // Placeholder
              icon={<FaArrowDown />}
              color="red.500"
            />
            <FinancialCard
              title="Remaining Budget"
              value={financialData.remaining}
              change={3} // Placeholder
              icon={<FaArrowUp />}
              color="green.500"
            />
            <FinancialCard
              title="Budget Utilization"
              value={financialData.budgetUtilization}
              change={5} // Placeholder
              icon={<FaChartLine />}
              color="purple.500"
            />
            <FinancialCard
              title="Expense Interest"
              value={financialData.expenseInterest}
              change={0} // Placeholder
              icon={<FaChartLine />}
              color="orange.500"
            />
          </SimpleGrid>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Recent Transactions</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Description</Th>
                      <Th>Category</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {financialData.expenses.map((expense) => (
                      <Tr key={expense.id}>
                        <Td>{new Date(expense.date).toLocaleDateString()}</Td>
                        <Td>{expense.description}</Td>
                        <Td>{expense.category}</Td>
                        <Td>{expense.amount}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              expense.status === 'completed'
                                ? 'green'
                                : expense.status === 'pending'
                                ? 'yellow'
                                : 'red'
                            }
                          >
                            {expense.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default Financial;