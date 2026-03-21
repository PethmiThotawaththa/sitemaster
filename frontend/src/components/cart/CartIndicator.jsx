import React from 'react';
import {
  IconButton,
  Badge,
  Box,
} from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import useCartStore from '../../store/cartStore';

const CartIndicator = () => {
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <Box position="relative">
      <IconButton
        as={RouterLink}
        to="/cart"
        icon={<FaShoppingCart />}
        variant="ghost"
        aria-label="Shopping cart"
      />
      {itemCount > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          position="absolute"
          top="-2"
          right="-2"
          fontSize="xs"
        >
          {itemCount}
        </Badge>
      )}
    </Box>
  );
};

export default CartIndicator;