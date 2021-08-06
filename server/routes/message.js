module.exports = message => {
    const messageController = require("../controller/message.controller");
  
    var router = require("express").Router();
  
    router.post("/message",  messageController.createMessage);
    
    router.get('/message/:conversationId', messageController.getMessage);
  
    message.use('/', router);
  };