const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/:userId", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM wallets WHERE user_id=$1",
      [req.params.userId]
    );

    res.json(result.rows);

  } catch(err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;