const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Payment = require('../models/Payment');

const orderController = {
  createOrder: async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
      const { items, totalAmount, payment, deliveryAddress } = req.body;

      // Validate input
      if (!items || !totalAmount || !payment || !deliveryAddress) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check inventory and update quantities
      const inventoryUpdates = [];
      for (const item of items) {
        if (item.itemType === 'Inventory') {
          const inventory = await Inventory.findById(item.item).session(session);
          if (!inventory) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: `Inventory item ${item.item} not found` });
          }
          if (inventory.quantity < item.quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Insufficient quantity for ${inventory.name}` });
          }
          inventory.quantity -= item.quantity;
          inventoryUpdates.push(inventory.save({ session }));
        }
      }

      // Wait for all inventory updates to complete
      await Promise.all(inventoryUpdates);

      // Verify payment exists
      const paymentDoc = await Payment.findById(payment).session(session);
      if (!paymentDoc) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Payment record not found' });
      }

      // Create order
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        payment,
        deliveryAddress,
        status: 'pending',
      });

      const newOrder = await order.save({ session });
      await newOrder.populate({
        path: 'items.item',
        select: 'name price budget images attachments',
      });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(newOrder);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Create order error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate({
          path: 'items.item',
          select: 'name price budget images attachments',
        })
        .populate('payment', 'status');

      // Debug: Log the orders to inspect the items.item field
      console.log('Fetched user orders:', JSON.stringify(orders, null, 2));

      // Log image paths for debugging
      orders.forEach(order => {
        order.items.forEach(item => {
          if (item.item) {
            const imagePath = item.itemType === 'Inventory' ? item.item.images?.[0] : item.item.attachments?.[0];
            console.log(`Image path for item ${item.item.name} (${item.itemType}): ${imagePath}`);
          }
        });
      });

      // Ensure items.item is valid
      const ordersWithValidItems = orders.map(order => {
        const validItems = order.items.map(item => {
          if (!item.item) {
            console.warn(`Item not found for order ${order._id}, item ID: ${item.item}`);
            return {
              ...item,
              item: { name: 'Unknown Item', images: [] },
            };
          }
          return item;
        });
        return {
          ...order.toObject(),
          items: validItems,
        };
      });

      res.json(ordersWithValidItems);
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;
      const updatedOrder = await order.save();
      await updatedOrder.populate({
        path: 'items.item',
        select: 'name price budget images attachments',
      });

      res.json(updatedOrder);
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate({
          path: 'items.item',
          select: 'name price budget images attachments',
        })
        .populate('payment', 'status');

      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      await Order.deleteOne({ _id: req.params.id });
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  },
};

module.exports = orderController;