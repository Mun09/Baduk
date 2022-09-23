const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const cors = require("cors");

app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_coordinates", (data) => {
        socket.to(data.room).emit("receive_coordinates", data);
    })

    io.on("join_room", (data) => {
        socket.join(data);
    })

})

const PORT = 3002;

server.listen(PORT, ()=>console.log(`서버가 ${PORT} 에서 시작되었어요`))