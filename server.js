require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// PORT من .env أو 3000
const PORT = process.env.SOCKET_PORT || 3000;

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());

const players = {};

io.on("connection", (socket) => {

  players[socket.id] = {
    coins: 0,
    started: false,
    power: 1,
    last: Date.now()
  };

  socket.emit("init", players[socket.id]);

  socket.on("startMining", () => {
    const p = players[socket.id];
    if (!p || p.started) return;

    p.started = true;
    p.last = Date.now();
  });

  socket.on("tap", () => {
    const p = players[socket.id];
    if (!p) return;

    p.coins += 0.02 * p.power;

    socket.emit("state", {
      coins: p.coins,
      started: p.started
    });
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });

});

server.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT:", PORT);
});