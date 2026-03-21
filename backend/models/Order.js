const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'items.itemType',
    required: true,
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Inventory', 'Project'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);