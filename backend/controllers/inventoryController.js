const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

// Get all inventory items
exports.getInventory = async (req, res, next) => {
  try {
    console.log('Fetching inventory items...');
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    const inventory = await Inventory.find();
    console.log(`Successfully fetched ${inventory.length} items`);
    res.json(inventory);
  } catch (error) {
    console.error('Error in getInventory:', error);
    next(error);
  }
};

// Get single inventory item
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create inventory item
exports.createInventory = async (req, res) => {
  try {
    console.log('Creating inventory item...');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request user:', req.user);

    const requiredFields = ['name', 'description', 'category', 'price', 'quantity', 'supplier'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Handle multiple image files
    const imagePaths = req.files ? req.files.map(file => `/uploads/inventory/${file.filename}`) : [];

    const inventoryData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      supplier: req.body.supplier,
      images: imagePaths,
      createdBy: req.user._id
    };

    console.log('Creating inventory with data:', inventoryData);

    const inventory = new Inventory(inventoryData);
    const newInventory = await inventory.save();
    console.log('Successfully created inventory:', newInventory);
    res.status(201).json(newInventory);
  } catch (error) {
    console.error('Error in createInventory:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Error creating inventory item',
      error: error.message
    });
  }
};

// Update inventory item
exports.updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    // Handle new images if uploaded
    const imagePaths = req.files ? req.files.map(file => `/uploads/inventory/${file.filename}`) : inventory.images;

    const updatedData = {
      name: req.body.name || inventory.name,
      description: req.body.description || inventory.description,
      category: req.body.category || inventory.category,
      price: req.body.price ? parseFloat(req.body.price) : inventory.price,
      quantity: req.body.quantity ? parseInt(req.body.quantity) : inventory.quantity,
      supplier: req.body.supplier || inventory.supplier,
      images: imagePaths,
      createdBy: req.user._id
    };

    Object.assign(inventory, updatedData);
    const updatedInventory = await inventory.save();
    res.json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete inventory item
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    await inventory.deleteOne();
    res.json({ message: 'Inventory deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inventory quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const inventory = await Inventory.findById(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    inventory.quantity = quantity;
    const updatedInventory = await inventory.save();
    res.json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get inventory by category
exports.getInventoryByCategory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ category: req.params.category });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory quantity
exports.getInventoryQuantity = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ quantity: inventory.quantity, name: inventory.name });
  } catch (error) {
    console.error('Error fetching inventory quantity:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};