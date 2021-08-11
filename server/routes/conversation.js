module.exports = Conversation => {
    const conversationController = require("../controller/conversation.controller")

    var router = require("express").Router();

    router.post("/conversation", conversationController.createConversation);

    router.get("/conversation/:userId", conversationController.getConversation);
    router.get("/conversation/", conversationController.getAllConversation);

    Conversation.use('/', router);
};