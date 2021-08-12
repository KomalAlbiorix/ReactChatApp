const express = require("express");
const socket = require('socket.io');
const cors = require('cors');
const { json } = require("body-parser");


const app = express();
app.use(cors())
app.use(express, json())
const server = app.listen('4000', () => {
    console.log("server started")
})

const addUser = (userId, socketId) => {
    console.log("userId", userId, "socketId", socketId)
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
    console.log("users===>", users)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}
const getUser = (receiverId) => {
    return users.find(user => user.userId = receiverId)
}

io = socket(server)
let users = []




io.on('connection', (socket) => {
    // console.log("user connected")
    socket.on("addUser", (userId) => {
        console.log("users", users, userId)
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    socket.on("disconnect", () => {
        console.log("user Disconnet")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const user = getUser(receiverId)
        console.log("users", user);
        if (user) {
            io.to(user.socketId).emit("getMessages", {
                senderId,
                message
            })
        }
    })
})


