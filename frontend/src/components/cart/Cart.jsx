import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Divider,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { getCartImageUrl, handleImageError } from '../../utils/imageUtils';

const Cart = () => {
  const { cart, loading, error, removeFromCart, updateQuantity, getTotal } = useCartStore();
  const navigate = useNavigate();
  const toast = useToast();

  console.log('Cart data in Cart.jsx:', cart);

  const handleRemoveItem = async (itemId, itemType) => {
    try {
      await removeFromCart(itemId, itemType);
      toast({
        title: 'Success',
        description: 'Item removed from cart',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to remove item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleQuantityChange = async (itemId, itemType, value) => {
    try {
      const quantity = parseInt(value);
      if (isNaN(quantity) || quantity < 1) {
        toast({
          title: 'Error',
          description: 'Please enter a valid quantity (minimum 1)',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await updateQuantity(itemId, itemType, quantity);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update quantity',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Text>Loading cart...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4}>
          <Text>Your cart is empty</Text>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">Shopping Cart</Text>

        {cart.items.map((item, index) => {
          // Check if item.item is populated
          const isItemPopulated = item.item && typeof item.item === 'object' && item.item._id;
          if (!isItemPopulated) {
            console.error(`Item not populated for cart item ${index}:`, item);
            return (
              <Box key={`${item._id}-${index}`} p={4} borderWidth="1px" borderRadius="lg">
                <Text color="red.500">Error: Item data not loaded (ID: {item.item || 'Unknown'})</Text>
              </Box>
            );
          }

          const imageUrl = getCartImageUrl(
            item.itemType === 'Inventory' ? item.item.images?.[0] : item.item.attachments?.[0],
            item.itemType
          );
          const itemPrice = item.itemType === 'Inventory' ? item.item.price : item.item.budget;
          const totalPrice = itemPrice ? (itemPrice * item.quantity).toFixed(2) : 'N/A';

          console.log(`Rendering cart item ${index}:`, {
            name: item.item.name || 'Unknown Item',
            imageUrl,
            price: itemPrice,
            totalPrice,
          });

          return (
            <Box
              key={`${item.item._id}-${item.itemType}-${index}`}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              _hover={{ bg: 'gray.50' }}
            >
              <HStack spacing={4} align="start">
                <Image
                  src={imageUrl}
                  alt={item.item.name || 'Item'}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                  onError={(e) => handleImageError(e, item.item.name || 'Unknown Item')}
                  fallback={<Box boxSize="100px" bg="gray.100" borderRadius="md" />}
                />
                <VStack align="start" flex={1} spacing={2}>
                  <Text fontSize="lg" fontWeight="bold">
                    {item.item.name || 'Unknown Item'}
                  </Text>
                  <Text>Type: {item.itemType}</Text>
                  <HStack spacing={2}>
                    <Text>Quantity:</Text>
                    <NumberInput
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.item._id, item.itemType, value)}
                      min={1}
                      max={99}
                      width="100px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                  <Text fontWeight="bold">
                    {totalPrice !== 'N/A' ? `$${totalPrice}` : 'Price not available'}
                  </Text>
                </VStack>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleRemoveItem(item.item._id, item.itemType)}
                >
                  Remove
                </Button>
              </HStack>
            </Box>
          );
        })}

        <Divider />

        <HStack justify="space-between" py={4}>
          <Text fontSize="xl" fontWeight="bold">
            Total:
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            ${getTotal().toFixed(2)}
          </Text>
        </HStack>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleCheckout}
          isDisabled={cart.items.length === 0}
        >
          Proceed to Checkout
        </Button>
      </VStack>
    </Container>
  );
};

export default Cart;