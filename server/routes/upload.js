module.exports = Upload => {
    const UploadController = require("../controller/upload.controller");
    const { uploadFile } = require('../middleware/multer')

    var router = require("express").Router();

    router.post("/upload", uploadFile.single('attachment'), UploadController.UploadContent);

    
    Upload.use('/', router);
};