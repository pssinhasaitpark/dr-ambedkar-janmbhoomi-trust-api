const express = require('express');
const router = express.Router();
const {newsletter}=require("../../controllers")
const { upload } = require('../../middlewares/fileUploader'); 


router.post("/",upload,newsletter.subscribe)
router.get('/', newsletter.getAllSubscriptions);
router.put("/:id",newsletter.updateStatus)

module.exports = router;
