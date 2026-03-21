import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <Heading size="sm" mb={2}>
              Company
            </Heading>
            <Link as={RouterLink} to={'/about'}>
              About Us
            </Link>
            <Link as={RouterLink} to={'/contact'}>
              Contact
            </Link>
            <Link as={RouterLink} to={'/careers'}>
              Careers
            </Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Heading size="sm" mb={2}>
              Services
            </Heading>
            <Link as={RouterLink} to={'/projects'}>
              Project Management
            </Link>
            <Link as={RouterLink} to={'/inventory'}>
              Inventory Management
            </Link>
            <Link as={RouterLink} to={'/financial'}>
              Financial Management
            </Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Heading size="sm" mb={2}>
              Support
            </Heading>
            <Link as={RouterLink} to={'/help'}>
              Help Center
            </Link>
            <Link as={RouterLink} to={'/terms'}>
              Terms of Service
            </Link>
            <Link as={RouterLink} to={'/privacy'}>
              Privacy Policy
            </Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Heading size="sm" mb={2}>
              Contact Us
            </Heading>
            <Text>Email: info@sitemaster.com</Text>
            <Text>Phone: +1 234 567 890</Text>
            <Text>Address: 123 Construction St, Building City</Text>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
        >
          <Text>© 2024 SiteMaster. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <Link href={'#'}>Facebook</Link>
            <Link href={'#'}>Twitter</Link>
            <Link href={'#'}>LinkedIn</Link>
            <Link href={'#'}>Instagram</Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer; 