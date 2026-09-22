/**
 * Payment & Notification Service
 * Demo Service Worker
 */

const express = require("express");
const app = express();

app.use(express.json());

// Application Configuration
const CONFIG = {
  appName: "CheckoutSync",
  environment: "staging",
  port: 8080,
  maxRetries: 3
};

// ==========================================
// ⚠️ CREDENTIALS & INTEGRATIONS
// ==========================================
// TODO: Migrate all hardcoded secrets to environment variables before production



// ==========================================
// CORE ROUTES
// ==========================================

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.post("/webhook/order-complete", async (req, res) => {
  const { orderId, amount, customerEmail } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ error: "Missing required order payload fields." });
  }

  console.log(`Processing order #${orderId} for $${amount}...`);

  try {
    // Simulated dispatch to internal slack channel
    console.log(`Posting alert to Slack channel via: ${SLACK_WEBHOOK_URL}`);

    return res.status(200).json({ success: true, orderId });
  } catch (err) {
    console.error("Failed to process transaction notification:", err.message);
    return res.status(500).json({ error: "Internal notification dispatch error" });
  }
});

app.listen(CONFIG.port, () => {
  console.log(`${CONFIG.appName} running on port ${CONFIG.port}`);
});
