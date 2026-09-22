/**
 * User & Report Export Service
 */
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// 1. REFLECTED XSS (CWE-79)
// CodeQL Flag: "Reflected cross-site scripting"
// Untrusted input from req.query.name is sent directly to res.send() as HTML
app.get("/welcome", (req, res) => {
  const userName = req.query.name;
  
  // ⚠️ VULNERABILITY: Raw injection into HTML response
  const htmlResponse = `<h1>Welcome back, ${userName}!</h1>`;
  res.set("Content-Type", "text/html");
  res.send(htmlResponse);
});

// 2. PATH TRAVERSAL / ARBITRARY FILE ACCESS (CWE-22 / CWE-73)
// CodeQL Flag: "Path traversal / Arbitrary file read"
// Untrusted filename from req.query.file passes into fs.readFile()
app.get("/download-report", (req, res) => {
  const userFile = req.query.file;
  
  // ⚠️ VULNERABILITY: No sanitization against ../../ patterns
  const filePath = path.join(__dirname, "reports", userFile);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("File not found");
    }
    res.send(data);
  });
});

module.exports = app;
