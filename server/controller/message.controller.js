const Message = require("../models/Message");


//new conversation
exports.createMessage = async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage)
    }
    catch (err) {
        res.status(500).json(err)
    }

}

// get conversation
exports.getMessage = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId })
        res.status(200).json(messages)
    }
    catch (err) {
        res.status(500).json(err)
    }

}

// exports.getMessage = async (req, res) => {
//     let senderId=req.body.senderId
//     let receiverId=req.body.receiverId
//     try {
//         const messages = await Message.find({ senderId: senderId,conversationId:receiverId })
//         res.status(200).json(messages)
//     }

//     catch (err) {
//         res.status(500).json(err)
//     }
// }