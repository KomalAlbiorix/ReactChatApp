const Upload = require('../models/upload');



//upload new content (image,video)
exports.UploadContent = async (req, res) => {
    const newUpload = new Upload({
        url: "upload/" + req.file.originalname,
        type: req.body.type
    });
    try {
        const saveAttachment = await newUpload.save();
        res.status(200).json(saveAttachment)
    }
    catch (err) {
        res.status(500).json(err)
    }

}