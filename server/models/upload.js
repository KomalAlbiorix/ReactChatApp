const mongoose = require("mongoose");

const Upload = new mongoose.Schema(
    {
        url:{
            type:String,
        },
        type: {
            type: String,
        },
  
    },
    { timestamps: true }
);

module.exports = mongoose.model("upload", Upload);
