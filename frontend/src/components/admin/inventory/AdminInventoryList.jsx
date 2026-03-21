import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  Select,
  IconButton,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  Textarea,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, DownloadIcon, SettingsIcon } from '@chakra-ui/icons';
import useInventoryStore from '../../../store/inventoryStore';
import useUserStore from '../../../store/userStore'; // Update to useUserStore

const AdminInventoryList = () => {
  const {
    inventory,
    loading,
    error,
    fetchInventory,
    addItem,
    updateItem,
    deleteItem,
    generateReport,
  } = useInventoryStore();
  const { isAuthenticated, isAdmin } = useUserStore(); // Update to useUserStore, use isAdmin

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
    supplier: '',
    images: [],
  });

  const toast = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    console.log('AdminInventoryList: isAuthenticated=', isAuthenticated, 'isAdmin=', isAdmin, 'isInitialLoad=', isInitialLoad);
    const loadInventory = async () => {
      try {
        console.log('AdminInventoryList: Fetching inventory');
        await fetchInventory();
      } catch (err) {
        toast({
          title: 'Error fetching inventory',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsInitialLoad(false);
      }
    };

    if (isAuthenticated && isAdmin && isInitialLoad) {
      loadInventory();
    }
  }, [isAuthenticated, isAdmin, isInitialLoad, fetchInventory]);

  console.log('AdminInventoryList: loading=', loading, 'error=', error, 'inventory=', inventory);

  if (!isAuthenticated || !isAdmin) {
    console.log('AdminInventoryList: Not authenticated or not an admin');
    return (
      <Center h="200px">
        <Text>
          {isAuthenticated ? 'Admin access required' : 'Please log in to access this page'}
        </Text>
      </Center>
    );
  }

  if (loading && isInitialLoad) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500" mb={4}>{error}</Text>
        <Button onClick={() => setIsInitialLoad(true)}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Admin access required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.images) {
        Array.from(formData.images).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      if (selectedItem) {
        await updateItem(selectedItem._id, formDataToSend);
        toast({
          title: 'Success',
          description: 'Item updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addItem(formDataToSend);
        toast({
          title: 'Success',
          description: 'Item added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      resetForm();
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

  const resetForm = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      quantity: 0,
      supplier: '',
      images: [],
    });
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
      images: item.images,
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Admin access required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this item?')) {
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
    }
  };

  const handleGenerateReport = async () => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: 'Error',
        description: 'Admin access required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await generateReport('inventory');
      toast({
        title: 'Success',
        description: 'Report generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error generating report',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredItems = (inventory || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="300px"
            />
          </Box>
          <HStack>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              width="200px"
            >
              <option value="all">All Categories</option>
              <option value="raw">Raw Materials</option>
              <option value="finished">Finished Goods</option>
              <option value="tools">Tools</option>
            </Select>
            <Button
              leftIcon={<DownloadIcon />}
              onClick={handleGenerateReport}
              colorScheme="green"
            >
              Export
            </Button>
            <Button
              leftIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                onOpen();
              }}
              colorScheme="blue"
            >
              Add Item
            </Button>
          </HStack>
        </HStack>

        {filteredItems.length === 0 ? (
          <Text textAlign="center" mt={4}>No inventory items found</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
                <Th>Status</Th>
                <Th>Supplier</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredItems.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>
                    <Badge colorScheme={item.category === 'raw' ? 'blue' : 'green'}>
                      {item.category}
                    </Badge>
                  </Td>
                  <Td>${item.price.toFixed(2)}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        item.quantity > 10
                          ? 'green'
                          : item.quantity > 0
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {item.quantity > 10
                        ? 'In Stock'
                        : item.quantity > 0
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </Badge>
                  </Td>
                  <Td>{item.supplier}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        onClick={() => handleEdit(item)}
                        colorScheme="blue"
                        size="sm"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(item._id)}
                        colorScheme="red"
                        size="sm"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedItem ? 'Edit Item' : 'Add New Item'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      <option value="raw">Raw Materials</option>
                      <option value="finished">Finished Goods</option>
                      <option value="tools">Tools</option>
                    </Select>
                  </FormControl>

                  <HStack width="100%" spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Price</FormLabel>
                      <NumberInput
                        value={formData.price}
                        onChange={(value) =>
                          setFormData({ ...formData, price: parseFloat(value) || 0 })
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

                    <FormControl isRequired>
                      <FormLabel>Quantity</FormLabel>
                      <NumberInput
                        value={formData.quantity}
                        onChange={(value) =>
                          setFormData({ ...formData, quantity: parseInt(value) || 0 })
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
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel>Supplier</FormLabel>
                    <Input
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Images</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setFormData({ ...formData, images: e.target.files })
                      }
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" width="full">
                    {selectedItem ? 'Update Item' : 'Add Item'}
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default AdminInventoryList;