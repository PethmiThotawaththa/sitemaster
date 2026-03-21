const Cart = require('../models/Cart');
const Inventory = require('../models/Inventory');
const Project = require('../models/Project');

const cartController = {
  // Get user's cart
  getCart: async (req, res) => {
    try {
      console.log('getCart called');
      console.log(`Fetching cart for user: ${req.user.id}`);
      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        console.log('Cart not found, creating new cart');
        cart = await Cart.create({
          user: req.user.id,
          items: [],
          totalAmount: 0,
        });
      }

      // Explicitly populate items based on itemType
      if (cart.items.length > 0) {
        console.log('Populating cart items...');
        const populatedItems = await Promise.all(
          cart.items.map(async (cartItem) => {
            let populatedItem;
            if (cartItem.itemType === 'Inventory') {
              populatedItem = await Inventory.findById(cartItem.item);
            } else if (cartItem.itemType === 'Project') {
              populatedItem = await Project.findById(cartItem.item);
            }
            return {
              ...cartItem.toObject(),
              item: populatedItem || cartItem.item,
            };
          })
        );
        cart.items = populatedItems;
      }

      console.log('Cart after population:', JSON.stringify(cart, null, 2));
      res.json(cart);
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  // Add/Update item in cart
  addToCart: async (req, res) => {
    const { itemId, itemType, quantity } = req.body;

    try {
      console.log(`addToCart called with itemId: ${itemId}, itemType: ${itemType}, quantity: ${quantity}`);
      // Validate input
      if (!itemId || !itemType || !quantity) {
        return res.status(400).json({
          message: 'Missing required fields: itemId, itemType, and quantity are required',
        });
      }

      // Validate item exists
      let item;
      if (itemType === 'Inventory') {
        item = await Inventory.findById(itemId);
      } else if (itemType === 'Project') {
        item = await Project.findById(itemId);
      }

      if (!item) {
        return res.status(404).json({ message: `${itemType} item not found` });
      }

      // Find or create cart
      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
      }

      // Find item in cart
      const itemIndex = cart.items.findIndex(
        (i) => i.item.toString() === itemId && i.itemType === itemType
      );

      // Update or add item
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = parseInt(quantity); // Set to new quantity
      } else {
        cart.items.push({
          item: itemId,
          itemType,
          quantity: parseInt(quantity),
        });
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const cartItem of cart.items) {
        const fetchedItem = await (cartItem.itemType === 'Inventory'
          ? Inventory.findById(cartItem.item)
          : Project.findById(cartItem.item));
        const itemPrice = cartItem.itemType === 'Inventory' ? fetchedItem.price : fetchedItem.budget;
        totalAmount += itemPrice * cartItem.quantity;
      }
      cart.totalAmount = totalAmount;

      // Save the cart
      await cart.save();

      // Populate items after saving
      const populatedItems = await Promise.all(
        cart.items.map(async (cartItem) => {
          let populatedItem;
          if (cartItem.itemType === 'Inventory') {
            populatedItem = await Inventory.findById(cartItem.item);
          } else if (cartItem.itemType === 'Project') {
            populatedItem = await Project.findById(cartItem.item);
          }
          return {
            ...cartItem.toObject(),
            item: populatedItem || cartItem.item,
          };
        })
      );
      cart.items = populatedItems;

      console.log('Cart updated:', JSON.stringify(cart, null, 2));
      return res.json(cart);
    } catch (error) {
      console.error('Add/Update cart error:', error);
      return res.status(500).json({
        message: error.message || 'Server error',
        error: error.toString(),
      });
    }
  },

  // Remove item from cart
  removeFromCart: async (req, res) => {
    const { itemId, itemType } = req.params;
    try {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.items = cart.items.filter(
        (i) => !(i.item.toString() === itemId && i.itemType === itemType)
      );

      // Calculate total amount
      let totalAmount = 0;
      for (const cartItem of cart.items) {
        const fetchedItem = await (cartItem.itemType === 'Inventory'
          ? Inventory.findById(cartItem.item)
          : Project.findById(cartItem.item));
        const itemPrice = cartItem.itemType === 'Inventory' ? fetchedItem.price : fetchedItem.budget;
        totalAmount += itemPrice * cartItem.quantity;
      }
      cart.totalAmount = totalAmount;

      await cart.save();

      // Populate items after saving
      const populatedItems = await Promise.all(
        cart.items.map(async (cartItem) => {
          let populatedItem;
          if (cartItem.itemType === 'Inventory') {
            populatedItem = await Inventory.findById(cartItem.item);
          } else if (cartItem.itemType === 'Project') {
            populatedItem = await Project.findById(cartItem.item);
          }
          return {
            ...cartItem.toObject(),
            item: populatedItem || cartItem.item,
          };
        })
      );
      cart.items = populatedItems;

      console.log('Cart after removal:', JSON.stringify(cart, null, 2));
      return res.json(cart);
    } catch (error) {
      console.error('Remove from cart error:', error);
      return res.status(500).json({ message: error.message || 'Server error' });
    }
  },
};

module.exports = cartController;