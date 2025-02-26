const express = require('express');
const router = express.Router();
const {news}=require("../../controllers")
const { upload, convertImagesToWebPMultiple ,uploadMultiple1, uploadMultiple} = require('../../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



router.post("/",uploadMultiple1,convertImagesToWebPMultiple,news.addNewsData,sendEmailToSubscribers)
router.get("/",news.getNewsData);
router.get("/get/:id",news.getNewsDataById);
router.put("/:id",upload,convertImagesToWebPMultiple,news.updateNewsData,sendEmailToSubscribers)
router.delete("/:id",news.deleteNewsData)

module.exports = router;
