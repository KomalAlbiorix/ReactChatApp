const mongoose = require("mongoose");

const GroupChat = new mongoose.Schema(
    {
        groupImage:{
            type:String,
        },
        groupName: {
            type: String,
        },
        members:{
            type:Array
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("groupChat", GroupChat);
