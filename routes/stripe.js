import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeRouter = express.Router();

stripeRouter.post('/checkout', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: amount, // amount must be in cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/dashboard/success",
      cancel_url: "http://localhost:5173/dashboard/cancel",
    });

    // ✅ Return URL instead of session ID
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default stripeRouter;
