const io = require('socket.io')(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}
const getUser = (receiverId) => {
    return users.find(user => user.userId = receiverId)
}

io.on('connection', (socket) => {
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUser", users)
    })

    socket.on("disconnect", () => {
        console.log("user Disconnet")
        removeUser(socket.id)
        io.emit("getUser", users)
    })

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        console.log("senderId",senderId)
        const user = getUser(receiverId,receiverId,message)
        io.to(user.socketId).emit("getMessage", {
            senderId,
            message
        })
    })
})