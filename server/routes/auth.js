module.exports = app => {
  const authController = require("../controller/auth.controller");
  const { uploadFile } = require('../middleware/multer')

  var router = require("express").Router();

  router.post("/register", uploadFile.single('profilePicture'), authController.register);

  router.post("/login", authController.login);

  router.get('/user/:userId', authController.getUser);

  app.use('/auth', router);
};