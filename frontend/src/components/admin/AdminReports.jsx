import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Select,
  FormControl,
  FormLabel,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import axios from '../../utils/axiosConfig'; // Update to use the configured axios instance

const AdminReports = () => {
  const [reportType, setReportType] = useState('user');
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const generateReport = async (type) => {
    setLoading(true);
    setReportType(type);
    try {
      const response = await axios.get(`/api/admin/reports/${type}`, {
        params: { dateRange },
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${dateRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'Report generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error generating report',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      title: 'User Report',
      description: 'List of users, their roles, and statuses',
      type: 'user',
    },
    {
      title: 'Payment Report',
      description: 'Payment transactions, amounts, and statuses',
      type: 'payment',
    },
    {
      title: 'Project Report',
      description: 'Project details, timelines, and progress',
      type: 'project',
    },
    {
      title: 'Inventory Report',
      description: 'Stock levels, low stock alerts, and inventory movements',
      type: 'inventory',
    },
    {
      title: 'Order Report',
      description: 'Order details, statuses, and totals',
      type: 'order',
    },
  ];

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Reports</Heading>
          <Text color="gray.500">Generate and download system reports</Text>
        </Box>

        <HStack spacing={4}>
          <FormControl maxW="200px">
            <FormLabel>Date Range</FormLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>
          </FormControl>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {reportTypes.map((report) => (
            <Card key={report.type}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="md">{report.title}</Heading>
                    <Text color="gray.500" mt={2}>
                      {report.description}
                    </Text>
                  </Box>
                  <Button
                    leftIcon={<DownloadIcon />}
                    colorScheme="blue"
                    isLoading={loading && reportType === report.type}
                    onClick={() => generateReport(report.type)}
                  >
                    Generate Report
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default AdminReports;