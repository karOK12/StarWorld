const http = require('http');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const server = http.createServer(( req, res ) => {
    if (req.method === 'GET' && req.url === '/') {
        // مثال بسيط: إرسال صفحة HTML كاستجابة
        fs.readFile('./client/public/index.html', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Error loading page');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});