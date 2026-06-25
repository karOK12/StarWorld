const http = require('http');
const fs = require('fs');
require('dotenv').config();

const { Pool } = require("pg");

// 🔗 اتصال Neon DB
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 🔢 توليد OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const server = http.createServer((req, res) => {

    // 🌐 CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // -------------------------
    // OPTIONS (مهم للـ CORS)
    // -------------------------
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        return res.end();
    }

    // -------------------------
    // الصفحة الرئيسية
    // -------------------------
    if (req.method === 'GET' && req.url === '/') {

        fs.readFile('./client/public/index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error loading page');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    // -------------------------
    // توليد OTP (تخزين في Neon)
    // -------------------------
    else if (req.method === 'GET' && req.url.startsWith('/otp')) {

        const otp = generateOTP();
        const email = "test@example.com"; // لاحقاً من المستخدم

        pool.query(
            "INSERT INTO otp_codes (email, code) VALUES ($1, $2)",
            [email, otp]
        ).then(() => {

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: "OTP saved in Neon DB",
                otp: otp
            }));

        }).catch(err => {

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: err.message
            }));
        });
    }

    // -------------------------
    // تحقق OTP من Neon DB
    // -------------------------
    else if (req.method === 'POST' && req.url === '/verify-otp') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {

            try {
                const { email, otp } = JSON.parse(body);

                const result = await pool.query(
                    `SELECT * FROM otp_codes 
                     WHERE email = $1 AND code = $2 
                     ORDER BY id DESC 
                     LIMIT 1`,
                    [email, otp]
                );

                if (result.rows.length > 0) {

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: "OTP Verified"
                    }));

                } else {

                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: "Invalid OTP"
                    }));
                }

            } catch (err) {

                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: err.message
                }));
            }
        });
    }

    // -------------------------
    // 404
    // -------------------------
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// 🚀 تشغيل السيرفر
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});