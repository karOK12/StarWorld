const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  coins: { type: Number, default: 0 },
  power: { type: Number, default: 1 },
  started: { type: Boolean, default: false }
});

module.exports = mongoose.model("Player", PlayerSchema);