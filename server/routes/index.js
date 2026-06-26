const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

router.use("/wallet", require("./walletRoutes"));
router.use("/deposit", require("./depositRoutes"));
router.use("/withdrawal", require("./withdrawalRoutes"));
router.use("/transactions", require("./transactionRoutes"));
router.use("/mining", require("./miningRoutes"));

// 👇 هذا اللي ضفناه
router.use("/user", require("./userRoutes"));

module.exports = router;