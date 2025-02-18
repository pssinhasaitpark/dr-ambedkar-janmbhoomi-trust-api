const express = require('express');
const router = express.Router();
const {news}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 


router.post("/",upload,convertImagesToWebP,news.addNewsData)
router.get("/",news.getNewsData);
router.get("/get/:id",news.getNewsDataById);
router.put("/:id",upload,convertImagesToWebP,news.updateNewsData)
router.delete("/:id",news.deleteNewsData)

module.exports = router;
