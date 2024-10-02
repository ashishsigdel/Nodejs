import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile("./public/index.html");
});

io.on("connection", (socket) => {
  console.log("A new user connected: ", socket.id);
  socket.on("user-message", (message) => {
    // console.log("A new message received: ", message);
    io.emit("server-message", message);
  });
});

server.listen(8000, () => {
  console.log("Server running...");
});
