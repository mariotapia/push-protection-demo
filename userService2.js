/**
 * Authentication & Telemetry Service
 */
const express = require("express");
const crypto = require("crypto");
const http = require("http");

const app = express();
app.use(express.json());

// ⚠️ VULNERABILITY 1: Insecure Hashing Algorithm (CWE-327 / CWE-328)
// CodeQL Flag: "Use of a broken or weak cryptographic algorithm"
// Copilot Autofix will cleanly upgrade 'md5' to 'sha256'
app.post("/auth/token", (req, res) => {
  const { username, salt } = req.body;

  // CodeQL triggers on crypto.createHash with 'md5'
  const hash = crypto.createHash("md5").update(username + salt).digest("hex");

  res.json({ sessionToken: hash });
});

// ⚠️ VULNERABILITY 2: Cleartext Transmission of Sensitive Data (CWE-319)
// CodeQL Flag: "Transmission of sensitive data via HTTP"
// Copilot Autofix will replace 'http' with 'https'
app.post("/telemetry/send", (req, res) => {
  const { apiKey, payload } = req.body;

  // Insecure HTTP request with sensitive API credential
  const targetUrl = "http://api.analytics-vendor.internal/collect?token=" + encodeURIComponent(apiKey);

  http.get(targetUrl, (apiRes) => {
    res.status(200).json({ status: "dispatched" });
  }).on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = app;
