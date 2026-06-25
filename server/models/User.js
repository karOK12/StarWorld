const db = require("../config/db");

class User {
  static async getById(id) {
    const result = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async getByEmail(email) {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  static async updateBalance(id, balance) {
    const result = await db.query(
      "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
      [balance, id]
    );
    return result.rows[0];
  }

  static async updatePower(id, power) {
    const result = await db.query(
      "UPDATE users SET power = $1 WHERE id = $2 RETURNING *",
      [power, id]
    );
    return result.rows[0];
  }
}

module.exports = User;