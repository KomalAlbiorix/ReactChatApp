const mongoose = require("mongoose");

const Message = new mongoose.Schema(
    {
        conversationId:{
            type:String,
        },
        senderId: {
            type: String,
        },
        message:{
            type:String
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("message", Message);
