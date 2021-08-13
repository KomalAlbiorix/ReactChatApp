const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("calling")
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    console.log("file.originalname",file)
      cb(null, file.originalname)
  }
})
// const storage =multer.memoryStorage();


let uploadFile = multer({
  storage: storage,
});

module.exports = {
  uploadFile
}
