const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemType',
    required: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Inventory', 'Project']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

// Debug population
cartSchema.pre('findOne', function(next) {
  console.log('Cart findOne hook: Preparing to populate items.item');
  this.populate('items.item');
  next();
});

module.exports = Cart;