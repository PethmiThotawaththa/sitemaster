import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Badge,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import useInventoryStore from '../../store/inventoryStore';
import useUserStore from '../../store/userStore';

const InventoryList = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
    supplier: '',
  });

  const { items, loading, error, fetchItems, addItem, updateItem, deleteItem, generateReport, setSearchTerm, setFilters, getFilteredItems } = useInventoryStore();
  const { isAdmin, isSupplier } = useUserStore();

  useEffect(() => {
    fetchItems().catch((err) => {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }, [fetchItems, toast]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await updateItem(selectedItem._id, formData);
        toast({
          title: 'Success',
          description: 'Item updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addItem(formData);
        toast({
          title: 'Success',
          description: 'Item added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        supplier: '',
      });
      setSelectedItem(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      supplier: item.supplier,
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReport = async (type) => {
    try {
      await generateReport(type);
      toast({
        title: 'Success',
        description: 'Report generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>Inventory Management</Heading>
        <Flex gap={2}>
          <Button
            leftIcon={<DownloadIcon />}
            onClick={() => handleReport('inventory')}
            colorScheme="green"
          >
            Generate Report
          </Button>
          {(isAdmin || isSupplier) && (
            <Button
              leftIcon={<AddIcon />}
              onClick={() => {
                setSelectedItem(null);
                setFormData({
                  name: '',
                  description: '',
                  category: '',
                  price: 0,
                  quantity: 0,
                  supplier: '',
                });
                onOpen();
              }}
              colorScheme="blue"
            >
              Add Item
            </Button>
          )}
        </Flex>
      </Flex>

      <Flex gap={4} mb={4}>
        <Input
          placeholder="Search items..."
          value={setSearchTerm}
          onChange={handleSearch}
          width="300px"
        />
        <Select
          placeholder="Category"
          name="category"
          value={setFilters.category}
          onChange={handleFilterChange}
          width="200px"
        >
          <option value="all">All Categories</option>
          <option value="raw">Raw Materials</option>
          <option value="finished">Finished Goods</option>
          <option value="tools">Tools</option>
        </Select>
        <Select
          placeholder="Supplier"
          name="supplier"
          value={setFilters.supplier}
          onChange={handleFilterChange}
          width="200px"
        >
          <option value="all">All Suppliers</option>
          {/* Add supplier options dynamically */}
        </Select>
      </Flex>

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
            <Th>Supplier</Th>
            <Th>Status</Th>
            {(isAdmin || isSupplier) && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {getFilteredItems().map((item) => (
            <Tr key={item._id}>
              <Td>{item.name}</Td>
              <Td>
                <Badge colorScheme={item.category === 'raw' ? 'blue' : 'green'}>
                  {item.category}
                </Badge>
              </Td>
              <Td>${item.price.toFixed(2)}</Td>
              <Td>{item.quantity}</Td>
              <Td>{item.supplier}</Td>
              <Td>
                <Badge
                  colorScheme={item.quantity > 0 ? 'green' : 'red'}
                >
                  {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </Td>
              {(isAdmin || isSupplier) && (
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleEdit(item)}
                    mr={2}
                    colorScheme="blue"
                    aria-label="Edit item"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(item._id)}
                    colorScheme="red"
                    aria-label="Delete item"
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="raw">Raw Materials</option>
                  <option value="finished">Finished Goods</option>
                  <option value="tools">Tools</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  value={formData.price}
                  onChange={(value) =>
                    setFormData({ ...formData, price: parseFloat(value) })
                  }
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput
                  value={formData.quantity}
                  onChange={(value) =>
                    setFormData({ ...formData, quantity: parseInt(value) })
                  }
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Supplier</FormLabel>
                <Input
                  name="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  required
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" mb={4}>
                {selectedItem ? 'Update Item' : 'Add Item'}
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InventoryList; 