import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import Order from '../model/Order.js';
import Product from '../model/Product.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeRouter = express.Router();

stripeRouter.post('/checkout', async (req, res) => {
  try {
    const { products, amount, value } = req.body;
    // For now, use a default user ID - in production, this should come from auth
    const userId = '692ecc7b5209634ded89a435'; // Default user for testing

    if (!products || !amount || amount <= 0 || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate total from products to prevent tampering
    const calculatedTotal = products.reduce(
      (total, product) => total + product.price * product.qty,
      0
    );

    if (Math.abs(calculatedTotal - amount / 100) > 0.01) {
      return res.status(400).json({ error: "Amount mismatch" });
    }

    // Create order items
    const orderItems = products.map(item => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
      image: item.image?.[0] || ''
    }));

    // Create order with pending status
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress: {
        fullName: value.fullName,
        email: value.email,
        address: value.address,
        city: value.city,
        zip: value.zip
      },
      totalPrice: amount / 100,
      stripeSessionId: '', // Will be set after creating session
      status: 'pending'
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: products.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image?.[0] ? [item.image[0]] : undefined
          },
          unit_amount: Math.round(item.price * 100), // convert to cents
        },
        quantity: item.qty,
      })),
      success_url: `http://localhost:5173/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/dashboard/cancel",
      metadata: {
        orderId: order._id.toString()
      }
    });

    // Update order with session ID
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook handler
stripeRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Find the order using metadata
        const order = await Order.findById(session.metadata.orderId);
        
        if (order) {
          // Update order with payment information
          order.isPaid = true;
          order.paidAt = new Date();
          order.status = 'processing';
          order.paymentResult = {
            id: session.payment_intent,
            status: session.payment_status,
            update_time: new Date().toISOString(),
            email_address: session.customer_details?.email
          };
          
          await order.save();
          
          // Update product stock
          for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity }
            });
          }
          
          console.log(`Order ${order._id} payment confirmed`);
        }
      } catch (err) {
        console.error('Error updating order:', err);
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

// Get order by session ID (for success page)
stripeRouter.get('/order/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price');
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default stripeRouter;



//........................................................
//........................................................
// END //.................................................
//........................................................
//........................................................
