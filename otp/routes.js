const express = require('express');
const router = express.Router();
const generateOTP = require('./otp');

router.post('/send-otp', (req, res) => {
  const otp = generateOTP();
  // هنا ممكن ترسل OTP عبر البريد أو SMS
  res.json({ otp, message: 'OTP generated, send it to user!' });
});

module.exports = router;