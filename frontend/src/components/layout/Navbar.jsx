import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import CartIndicator from '../cart/CartIndicator';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ children, to }) => (
    <RouterLink to={to}>
      <Text
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
      >
        {children}
      </Text>
    </RouterLink>
  );

  const DesktopNav = () => (
    <Stack direction={'row'} spacing={4}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/inventory">Inventory</NavLink>
      <NavLink to="/financial">Financial</NavLink>
      <NavLink to="/about">About Us</NavLink> {/* Added About Us */}
      <NavLink to="/contact">Contact Us</NavLink> {/* Added Contact Us */}
      {isAdmin && <NavLink to="/admin">Admin Dashboard</NavLink>}
    </Stack>
  );

  const MobileNav = () => (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/inventory">Inventory</NavLink>
      <NavLink to="/financial">Financial</NavLink>
      <NavLink to="/about">About Us</NavLink> {/* Added About Us */}
      <NavLink to="/contact">Contact Us</NavLink> {/* Added Contact Us */}
      {isAdmin && <NavLink to="/admin">Admin Dashboard</NavLink>}
      <NavLink to="/cart">Cart</NavLink>
    </Stack>
  );

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onOpen}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontWeight="bold"
            fontSize="xl"
          >
            SiteMaster
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          align="center"
        >
          <CartIndicator />
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={user?.avatar}
                    name={user?.name}
                  />
                  <ChevronDownIcon />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                {isAdmin && (
                  <MenuItem as={RouterLink} to="/admin/users">
                    User Management
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.400'}
                _hover={{
                  bg: 'blue.300',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <MobileNav />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;