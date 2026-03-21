import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Badge,
  Icon,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ShoppingCartIcon } from '@chakra-ui/icons';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const cartItemCount = cart?.items?.length || 0;

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
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={{ base: 'center', md: 'left' }}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            as={Link}
            to="/"
          >
            SiteMaster
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          align="center"
        >
          <Button as={Link} to="/inventory" variant="ghost">
            Inventory
          </Button>
          <Button as={Link} to="/projects" variant="ghost">
            Projects
          </Button>

          {user ? (
            <>
              <Button as={Link} to="/cart" variant="ghost" position="relative">
                <HStack spacing={2}>
                  <FaShoppingCart />
                  {cartItemCount > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top="-1"
                      right="-1"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </HStack>
              </Button>
              <Button as={Link} to="/profile" variant="ghost">
                Profile
              </Button>
              {user.role === 'admin' && (
                <Button as={Link} to="/admin" variant="ghost">
                  Admin
                </Button>
              )}
              <Button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                colorScheme="blue"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost">
                Login
              </Button>
              <Button as={Link} to="/register" colorScheme="blue">
                Register
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      {/* Mobile menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <Link as={RouterLink} to="/projects">Projects</Link>
            <Link as={RouterLink} to="/inventory">Shop</Link>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
