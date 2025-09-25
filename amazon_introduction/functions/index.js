const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors({ origin: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success !" });
});

app.post("/payments/create", async (req, res) => {
  try {
    const total = req.query.total;
    const { payment_method_id } = req.body;

    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        payment_method: payment_method_id,
        confirmation_method: "manual",
        confirm: true,
        return_url: "http://localhost:5175/orders",
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      });
    } else {
      res.status(403).json({ message: "Total must be greater than 0" });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: error.message });
  }
});

exports.api = onRequest(app);
