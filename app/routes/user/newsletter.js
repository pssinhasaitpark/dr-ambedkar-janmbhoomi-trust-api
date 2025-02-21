const express = require('express');
const router = express.Router();
const {newsletter}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 



router.post("/",upload,convertImagesToWebP,newsletter.subscribe)
router.get('/', newsletter.getAllSubscriptions);

module.exports = router;
