const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Set global options
setGlobalOptions({ maxInstances: 10 });

// Initialize Stripe with fallback key
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Create Express app
const app = express();

// Middleware - Fix CORS for localhost development
app.use(cors({ origin: true }));
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is working!",
  });
});

// Payment endpoint
app.post("/payments/create", async (req, res) => {
  try {
    const total = req.query.total;
    const numericTotal = parseInt(total);

    if (numericTotal > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: numericTotal,
        currency: "usd",
      });

      res.status(201).json(paymentIntent);
    } else {
      res.status(403).json({
        message: "Total must be greater than 0",
      });
    }
  } catch (error) {
    console.error("Payment error:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Export the API
exports.api = onRequest(app);
