const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const { generateToken } = require('../utils/jwt');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new admin user
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, companyName, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new admin user
    const admin = new User({
      name,
      email,
      password,
      companyName,
      role,
      phone,
      address,
      isActive: true,
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        companyName: admin.companyName,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const inventoryCount = await Inventory.countDocuments();
    const orderCount = await Order.countDocuments();
    const lowStockItems = await Inventory.countDocuments({ quantity: { $lt: 10 } });

    res.json({
      users: userCount,
      inventory: inventoryCount,
      orders: orderCount,
      lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new admin
const registerAdmin = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role,
      phone,
      companyName,
      companyType,
      address 
    } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'phone', 'companyName', 'companyType', 'address'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (let the User model's pre-save hook handle password hashing)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
      status: 'active',
      phone,
      companyName,
      companyType,
      address,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        companyName: user.companyName,
        companyType: user.companyType,
        address: user.address,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, role, status } = req.body;
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Generate report
const generateReport = async (req, res) => {
  const { type } = req.params;
  const { dateRange } = req.query;

  // Calculate date filter based on dateRange
  let startDate;
  const endDate = new Date();
  switch (dateRange) {
    case 'today':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(0); // All time
  }

  try {
    let data;
    let title;
    switch (type) {
      case 'user':
        data = await User.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).select('name email role status companyName createdAt');
        title = 'User Report';
        break;
      case 'payment':
        data = await Payment.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('user', 'name email').select('user amount status createdAt');
        title = 'Payment Report';
        break;
      case 'project':
        data = await Project.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('createdBy', 'name').select('name description status startDate endDate createdBy');
        title = 'Project Report';
        break;
      case 'inventory':
        data = await Inventory.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).select('name description category price quantity supplier status createdAt');
        title = 'Inventory Report';
        break;
      case 'order':
        data = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('user', 'name').populate('items.item', 'name').select('user items totalAmount status createdAt');
        title = 'Order Report';
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Create PDF
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-report-${dateRange}.pdf`);
      res.send(pdfData);
    });

    // PDF content
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date Range: ${dateRange}`, { align: 'center' });
    doc.moveDown(2);

    if (data.length === 0) {
      doc.text('No data available for this period.', { align: 'center' });
    } else {
      data.forEach((item, index) => {
        doc.fontSize(14).text(`${index + 1}. ${item.name || item._id}`, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        
        if (type === 'user') {
          doc.text(`Name: ${item.name}`);
          doc.text(`Email: ${item.email}`);
          doc.text(`Role: ${item.role}`);
          doc.text(`Status: ${item.status}`);
          doc.text(`Company: ${item.companyName}`);
          doc.text(`Created: ${new Date(item.createdAt).toLocaleDateString()}`);
        } else if (type === 'payment') {
          doc.text(`User: ${item.user?.name || 'Unknown'} (${item.user?.email || 'N/A'})`);
          doc.text(`Amount: $${item.amount.toFixed(2)}`);
          doc.text(`Status: ${item.status}`);
          doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`);
        } else if (type === 'project') {
          doc.text(`Name: ${item.name}`);
          doc.text(`Description: ${item.description}`);
          doc.text(`Status: ${item.status}`);
          doc.text(`Start Date: ${new Date(item.startDate).toLocaleDateString()}`);
          doc.text(`End Date: ${new Date(item.endDate).toLocaleDateString()}`);
          doc.text(`Created By: ${item.createdBy?.name || 'Unknown'}`);
        } else if (type === 'inventory') {
          doc.text(`Name: ${item.name}`);
          doc.text(`Description: ${item.description}`);
          doc.text(`Category: ${item.category}`);
          doc.text(`Price: $${item.price.toFixed(2)}`);
          doc.text(`Quantity: ${item.quantity}`);
          doc.text(`Supplier: ${item.supplier}`);
          doc.text(`Status: ${item.status}`);
          doc.text(`Created: ${new Date(item.createdAt).toLocaleDateString()}`);
        } else if (type === 'order') {
          doc.text(`User: ${item.user?.name || 'Unknown'}`);
          doc.text(`Total Amount: $${item.totalAmount.toFixed(2)}`);
          doc.text(`Status: ${item.status}`);
          doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`);
          doc.text('Items:');
          item.items.forEach((orderItem, idx) => {
            doc.text(`  ${idx + 1}. ${orderItem.item?.name || 'Unknown'} - Quantity: ${orderItem.quantity}, Price: $${orderItem.price.toFixed(2)}`);
          });
        }
        doc.moveDown(1);
      });
    }

    doc.end();
  } catch (error) {
    console.error(`Error generating ${type} report:`, error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  registerAdmin,
  generateReport,
};