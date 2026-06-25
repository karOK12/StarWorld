const db = require("../config/db");

class Wallet {
  static async create(userId, walletType, walletAddress) {
    const result = await db.query(
      `INSERT INTO wallets
      (user_id, wallet_type, wallet_address)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [userId, walletType, walletAddress]
    );

    return result.rows[0];
  }

  static async getUserWallets(userId) {
    const result = await db.query(
      "SELECT * FROM wallets WHERE user_id = $1",
      [userId]
    );

    return result.rows;
  }

  static async getWalletByAddress(address) {
    const result = await db.query(
      "SELECT * FROM wallets WHERE wallet_address = $1",
      [address]
    );

    return result.rows[0];
  }
}

module.exports = Wallet;