const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['raw', 'finished', 'tools'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0,
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required'],
  }],
  status: {
    type: String,
    enum: ['available', 'low_stock', 'out_of_stock', 'discontinued'], // Added 'low_stock'
    default: 'available',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to automatically set status based on quantity
inventorySchema.pre('save', function(next) {
  if (this.quantity > 10) {
    this.status = 'available';
  } else if (this.quantity > 0) {
    this.status = 'low_stock';
  } else {
    this.status = 'out_of_stock';
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);