// const db = require("../models");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//REGISTER
exports.register = async (req, res) => {
  console.log("req.file.originalname", req.file)
  console.log("req.body.profilePicture", req.body.profilePicture)
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.profilePicture ? req.body.profilePicture : req.file.originalname
    });
    console.log("newUser", newUser)
    const user = await newUser.save();
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json(err)
  }
};

//LOGIN
exports.login = async (req, res) => {
  try {
    console.log("req",req)
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send({ message: "user not found" });

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).send({ message: "wrong password" })

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
};

//get a user by id
exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  const username = req.params.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all user
exports.getAllUser = async (req, res) => {
  try {
    if (req.query.username) {
      await User.find({ username: req.query.username.toLowerCase()}).then(data => {
        if (data) {
          res.status(200).send(data);
        }
      })
    }
    else {
      await User.find().then(data => {
        if (data) {
          res.status(200).send(data);
        }
      })
    }

  } catch (err) {
    res.status(500).json(err);
  }
};

//search user 

exports.searchUser = async (req, res) => {
  try {
    User.find({ username: req.params.username }).then(data => {
      console.log("dataa", data)
      if (data) {
        res.status(200).send(data);
      }
    })
  } catch (err) {
    res.status(500).json(err);
  }
};

