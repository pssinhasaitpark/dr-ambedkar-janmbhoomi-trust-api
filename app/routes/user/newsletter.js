const express = require('express');
const router = express.Router();
const {newsletter}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 



router.post("/",upload,newsletter.subscribe)

module.exports = router;
