const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
require("dotenv").config();

const { Pool } = require("pg");

const app = express();
const server = http.createServer(app);

// ===============================
// 🔗 Neon DB Connection
// ===============================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ===============================
// 🔢 OTP Generator
// ===============================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===============================
// 🌐 Middleware
// ===============================
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ===============================
// 🏠 Home Page
// ===============================
app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "client/public/index.html"), (err, data) => {
    if (err) {
      return res.status(500).send("Error loading page");
    }
    res.setHeader("Content-Type", "text/html");
    res.send(data);
  });
});

// ===============================
// 📥 USER ROUTES (Neon DB)
// ===============================
app.post("/user", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      "SELECT balance, power FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 💾 SAVE USER DATA
// ===============================
app.post("/user/save", async (req, res) => {
  try {
    const { email, balance, power } = req.body;

    await pool.query(
      `UPDATE users 
       SET balance = $1, power = $2 
       WHERE email = $3`,
      [balance, power, email]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🔐 OTP GENERATE
// ===============================
app.get("/otp", async (req, res) => {
  const otp = generateOTP();
  const email = "test@example.com";

  try {
    await pool.query(
      "INSERT INTO otp_codes (email, code) VALUES ($1, $2)",
      [email, otp]
    );

    res.json({
      message: "OTP saved",
      otp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🔐 OTP VERIFY
// ===============================
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      `SELECT * FROM otp_codes 
       WHERE email=$1 AND code=$2 
       ORDER BY id DESC LIMIT 1`,
      [email, otp]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "OTP Verified" });
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🚀 EXPORT FOR VERCEL + LOCAL
// ===============================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 http://localhost:${PORT}`);
  });
}

module.exports = app;