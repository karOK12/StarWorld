const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ===============================
// 📥 جلب بيانات المستخدم (balance + power)
// ===============================
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const result = await db.query(
      "SELECT balance, power FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// 💾 حفظ البيانات (balance + power)
// ===============================
router.post("/save", async (req, res) => {
  try {
    const { email, balance, power } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    await db.query(
      `UPDATE users 
       SET balance = $1, power = $2 
       WHERE email = $3`,
      [balance, power, email]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;