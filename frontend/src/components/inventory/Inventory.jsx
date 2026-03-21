import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  VStack,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  useToast,
  Container,
  HStack,
  Input,
  Select,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Skeleton,
  useDisclosure, // Added import for useDisclosure
} from '@chakra-ui/react';
import useInventoryStore from '../../store/inventoryStore';
import useCartStore from '../../store/cartStore';
import useUserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { getInventoryImageUrl, handleImageError } from '../../utils/imageUtils';
import axiosInstance from '../../utils/axiosConfig';

const Inventory = () => {
  const { inventory, fetchInventory, loading: inventoryLoading, error: inventoryError, searchTerm, setSearchTerm, filters, setFilters, getFilteredItems } = useInventoryStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (inventory.length === 0 && !inventoryLoading) {
      fetchInventory();
    }
  }, [fetchInventory, inventory, inventoryLoading]);

  const handleAddToCart = async (itemId, itemQuantity) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      // Fetch the latest quantity from the backend
      const response = await axiosInstance.get(`/api/inventory/quantity/${itemId}`);
      const { quantity: availableQuantity, name } = response.data;
      
      if (availableQuantity < 1) {
        throw new Error(`Item ${name} is out of stock.`);
      }
      
      if (availableQuantity < itemQuantity) {
        throw new Error(`Insufficient quantity for ${name}. Only ${availableQuantity} available.`);
      }

      await addToCart(itemId, 'Inventory', itemQuantity);
      toast({
        title: 'Success',
        description: 'Item added to cart',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const filteredItems = getFilteredItems();

  if (inventoryLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (inventoryError) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {inventoryError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>
          Our Products
        </Heading>

        <HStack spacing={4} mb={6}>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="400px"
          />
          <Select
            value={filters.category || 'all'}
            onChange={(e) => setFilters({ category: e.target.value })}
            maxW="200px"
          >
            <option value="all">All Categories</option>
            <option value="raw">Raw Materials</option>
            <option value="finished">Finished Goods</option>
            <option value="tools">Tools</option>
          </Select>
        </HStack>

        {filteredItems.length === 0 ? (
          <Text textAlign="center">No items found</Text>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {filteredItems.map((item) => {
              const imageUrl = getInventoryImageUrl(item.images?.[0]);
              const stockStatus = item.quantity > 10 ? 'In Stock' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock';
              const stockColor = item.quantity > 10 ? 'green' : item.quantity > 0 ? 'yellow' : 'red';

              return (
                <VStack
                  key={item._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  spacing={3}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Box
                    position="relative"
                    width="100%"
                    height="200px"
                    overflow="hidden"
                    borderRadius="md"
                    onClick={() => handleItemClick(item)}
                    cursor="pointer"
                  >
                    <Skeleton isLoaded={!!imageUrl} height="100%">
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        onError={(e) => handleImageError(e, item.name)}
                        loading="lazy"
                        fallback={<Box height="100%" width="100%" bg="gray.100" />}
                      />
                    </Skeleton>
                  </Box>
                  <Text fontSize="xl" fontWeight="bold">
                    {item.name}
                  </Text>
                  <Text>${item.price.toFixed(2)}</Text>
                  <Badge colorScheme={stockColor}>{stockStatus}</Badge>
                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={() => handleAddToCart(item._id, 1)}
                    isLoading={loading}
                    isDisabled={item.quantity === 0}
                  >
                    Add to Cart
                  </Button>
                </VStack>
              );
            })}
          </Grid>
        )}

        {/* Item Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedItem?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedItem && (
                <VStack spacing={4} align="stretch">
                  <AspectRatio ratio={16/9}>
                    <Image
                      src={getInventoryImageUrl(selectedItem.images?.[0])}
                      alt={selectedItem.name}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </AspectRatio>
                  <Text>{selectedItem.description}</Text>
                  <HStack justify="space-between">
                    <Badge
                      colorScheme={
                        selectedItem.quantity > 10
                          ? 'green'
                          : selectedItem.quantity > 0
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {selectedItem.quantity > 10
                        ? 'In Stock'
                        : selectedItem.quantity > 0
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </Badge>
                    <Text fontWeight="bold" fontSize="xl">
                      ${selectedItem.price.toFixed(2)}
                    </Text>
                  </HStack>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleAddToCart(selectedItem._id, 1)}
                    isDisabled={selectedItem.quantity === 0}
                    isLoading={loading}
                  >
                    Add to Cart
                  </Button>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default Inventory;