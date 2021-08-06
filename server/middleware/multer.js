const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})


let uploadFile = multer({
  storage: storage,
});

module.exports = {
  uploadFile
}
