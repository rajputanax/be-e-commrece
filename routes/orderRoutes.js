import express from 'express';
import Order from '../model/Order.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Get user's order history
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single order details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price');
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Check if order belongs to current user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to view this order" });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
