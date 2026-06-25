const express = require("express");
const router = express.Router();

let balance = 0;

router.post("/mine", (req, res) => {
    balance += 0.01;

    res.json({
        balance: balance
    });
});

module.exports = router;