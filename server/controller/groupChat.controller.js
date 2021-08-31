const GroupChat = require("../models/GroupChat");


//new conversation
exports.createGroupChat = async (req, res) => {
    const newGroupChat = new GroupChat({
        groupName: req.body.groupName,
        members: req.body.members
    });
    try {
        const savedChat = await newGroupChat.save();
        res.status(200).json(savedChat)
    }
    catch (err) {
        res.status(500).json(err)
    }

}

exports.getAllGroups = async (req, res) => {
    try {
        const getGroup = await  GroupChat.find({
            members: { $in: [req.params.userId] },
        })
        res.status(200).json(getGroup)
    }

    catch (err) {
        res.status(500).json(err)
    }
}
