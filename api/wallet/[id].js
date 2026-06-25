const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  try {
    const { id } = req.query;

    const result = await pool.query(
      "SELECT * FROM wallets WHERE user_id = $1",
      [id]
    );

    res.status(200).json(result.rows);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};