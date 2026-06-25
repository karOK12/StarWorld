const crypto = require('crypto');
const nodemailer = require('nodemailer'); // إذا أردت الإرسال عبر البريد

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // توليد رقم من 6 خانات
}

module.exports = generateOTP;