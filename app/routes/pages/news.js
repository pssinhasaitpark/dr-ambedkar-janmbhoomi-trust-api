const express = require('express');
const router = express.Router();
const {news}=require("../../controllers")
// const { upload, convertImagesToWebP} = require('../../middlewares/fileUploader'); 
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');

const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



router.post("/",imageConversionMiddlewareMultiple,news.addNewsData,sendEmailToSubscribers)
router.get("/",news.getNewsData);
router.get("/get/:id",news.getNewsDataById);
router.put("/:id",imageConversionMiddlewareMultiple,news.updateNewsData,sendEmailToSubscribers)
router.delete("/:id",news.deleteNewsData)

module.exports = router;
