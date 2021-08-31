module.exports = app => {
    const groupController = require("../controller/groupChat.controller");
  
    var router = require("express").Router();
  
    router.post("/group", groupController.createGroupChat);
  
    // router.post("/login", authController.login);
  
    // router.get('/user/:userId', authController.getUser);
  
    router.get('/group/:userId', groupController.getAllGroups);
  
    // router.get('/user/', authController.searchUser);
  
  
    app.use('/', router);
  };