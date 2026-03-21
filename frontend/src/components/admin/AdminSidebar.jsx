import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Text,
  Link,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaBoxes,
  FaChartBar,
  FaCog,
  FaUserPlus,
  FaClipboardList,
  FaBell,
  FaProjectDiagram,
  FaMoneyBillWave,
} from 'react-icons/fa';

const SidebarItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Link
      as={RouterLink}
      to={to}
      _hover={{ textDecoration: 'none', bg: hoverBg }}
      w="full"
    >
      <Box
        display="flex"
        alignItems="center"
        px={4}
        py={3}
        borderRadius="md"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : undefined}
      >
        <Icon as={icon} boxSize={5} mr={3} />
        <Text fontSize="sm" fontWeight={isActive ? "medium" : "normal"}>
          {children}
        </Text>
      </Box>
    </Link>
  );
};

const AdminSidebar = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w={64}
      h="full"
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      position="fixed"
      left={0}
      top={0}
      mt="60px" // Adjust based on your navbar height
    >
      <VStack spacing={1} align="stretch">
        <SidebarItem icon={FaHome} to="/admin">
          Dashboard
        </SidebarItem>
        <SidebarItem icon={FaUsers} to="/admin/users">
          User Management
        </SidebarItem>
        <SidebarItem icon={FaUserPlus} to="/admin/register">
          Add New User
        </SidebarItem>

        <Divider my={4} />

        <SidebarItem icon={FaBoxes} to="/admin/inventory">
          Inventory
        </SidebarItem>
        <SidebarItem icon={FaClipboardList} to="/admin/orders">
          Orders
        </SidebarItem>
        <SidebarItem icon={FaChartBar} to="/admin/reports">
          Reports
        </SidebarItem>

        <Divider my={4} />

        <SidebarItem icon={FaProjectDiagram} to="/admin/projects">
          Projects
        </SidebarItem>

        <SidebarItem icon={FaBell} to="/admin/notifications">
          Notifications
        </SidebarItem>
        <SidebarItem icon={FaCog} to="/admin/settings">
          Settings
        </SidebarItem>

        <SidebarItem icon={FaMoneyBillWave} to="/admin/payments">
          Payments
        </SidebarItem>
      </VStack>
    </Box>
  );
};

export default AdminSidebar; 