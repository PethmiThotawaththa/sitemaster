import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Image,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

const Checkout = () => {
  const { cart, checkout, clearCart, loading, error } = useCartStore();
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPaymentSlip(file);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentSlip) {
      toast({
        title: 'Error',
        description: 'Please upload a payment slip',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!deliveryAddress || deliveryAddress.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please provide a valid delivery address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await checkout({ paymentSlip, deliveryAddress });
      toast({
        title: 'Success',
        description: 'Order placed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/orders');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4} align="center">
          <Text>No items in cart</Text>
          <Button colorScheme="blue" onClick={() => navigate('/cart')}>
            Return to Cart
          </Button>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={4} align="center">
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
          <Button colorScheme="blue" onClick={() => navigate('/cart')}>
            Return to Cart
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Checkout</Heading>

        <Card>
          <CardHeader>
            <Heading size="md">Order Summary</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {cart.items.map((item) => (
                <Box key={`${item.item._id}-${item.itemType}`}>
                  <Text>{item.item.name} x {item.quantity}</Text>
                  <Text>
                    ${((item.itemType === 'Inventory' ? item.item.price : item.item.budget) * item.quantity).toFixed(2)}
                  </Text>
                </Box>
              ))}
              <Box pt={4}>
                <Text fontSize="xl" fontWeight="bold">
                  Total: ${cart.totalAmount.toFixed(2)}
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Delivery Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!deliveryAddress.trim()}>
                <FormLabel>Delivery Address</FormLabel>
                <Textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  isDisabled={loading}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Payment Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text>
                Please upload your payment slip after making the payment to our account:
              </Text>
              <Box p={4} bg="gray.100" borderRadius="md">
                <Text>Bank: Example Bank</Text>
                <Text>Account Number: 1234567890</Text>
                <Text>Account Name: SiteMaster</Text>
              </Box>
              
              <FormControl isRequired isInvalid={!paymentSlip}>
                <FormLabel>Upload Payment Slip</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  isDisabled={loading}
                />
                {paymentSlip && (
                  <Box mt={2}>
                    <Image
                      src={URL.createObjectURL(paymentSlip)}
                      alt="Payment Slip Preview"
                      maxH="200px"
                      borderRadius="md"
                    />
                  </Box>
                )}
              </FormControl>

              <Button
                colorScheme="blue"
                isLoading={loading}
                onClick={handleSubmit}
                disabled={!paymentSlip || !deliveryAddress.trim() || loading}
                width="full"
              >
                Submit Order
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Checkout;