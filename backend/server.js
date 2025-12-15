const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

// Serve static files from frontend directory
app.use(express.static(__dirname + "/../frontend"));

// Root route handler
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../frontend/index.html");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("setUsername", (username) => {
    onlineUsers[socket.id] = username;

    io.emit("onlineUsers", Object.values(onlineUsers));

    socket.broadcast.emit("serverMessage", `${username} đã tham gia phòng chat!`);
  });

  socket.on("chatMessage", (msg) => {
    const username = onlineUsers[socket.id] || "Ẩn danh";

    io.emit("chatMessage", {
      username,
      message: msg
    });
  });

  socket.on("disconnect", () => {
    const username = onlineUsers[socket.id];

    delete onlineUsers[socket.id];

    io.emit("onlineUsers", Object.values(onlineUsers));

    if (username) {
      io.emit("serverMessage", `${username} đã rời phòng!`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Realtime chat server chạy tại port ${PORT}`);
});
