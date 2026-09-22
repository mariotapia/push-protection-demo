/**
 * User Account Lookup Service
 */
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const db = new sqlite3.Database(":memory:");

// GET /user?id=123
router.get("/user", (req, res) => {
  const userId = req.query.id;

  // ⚠️ VULNERABILITY: Raw concatenation allows SQL Injection
  // CodeQL will flag this taint flow: req.query.id -> query -> db.all()
  const query = "SELECT id, username, email FROM users WHERE id = '" + userId + "'";

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database lookup failed" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: rows[0] });
  });
});

module.exports = router;
