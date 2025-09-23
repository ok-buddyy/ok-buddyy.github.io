require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.json());
app.use(express.static("../")); // serve frontend

// Fake DB (replace with real database)
const dbFile = "db.json";

// Create PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  const { name, email, ticket } = req.body;
  const amount = ticket === "vip" ? 10000 : 5000; // cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { name, email, ticket }
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

// Webhook to verify payment & send email
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;

    // Save registration
    const reg = { name: pi.metadata.name, email: pi.metadata.email, ticket: pi.metadata.ticket };
    let db = [];
    if (fs.existsSync(dbFile)) db = JSON.parse(fs.readFileSync(dbFile));
    db.push(reg);
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    transporter.sendMail({
      from: "TEDx <no-reply@tedx.com>",
      to: reg.email,
      subject: "TEDx Registration Confirmed",
      text: `Hi ${reg.name},\n\nYour ${reg.ticket} ticket is confirmed!\nSee you at TEDx.\n`
    });

    console.log("✅ Payment confirmed and email sent to", reg.email);
  }

  res.json({ received: true });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
