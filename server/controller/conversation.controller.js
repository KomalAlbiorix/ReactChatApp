const Conversation = require("../models/Conversation");


//new conversation
exports.createConversation= async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation)
    }
    catch (err) {
        res.status(500).json(err)
    }

}

//get conversation
exports.getConversation=async (req, res) => {
    try {
        const getConversation = await  Conversation.find({
            members: { $in: [req.params.userId] },
        })
        res.status(200).json(getConversation)
    }

    catch (err) {
        res.status(500).json(err)
    }

}