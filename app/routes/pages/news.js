const express = require('express');
const router = express.Router();
const {news}=require("../../controllers")
// const { upload, convertImagesToWebP} = require('../../middlewares/fileUploader'); 
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');
const{verifyToken,verifyAdmin}=require("../../middlewares/jwtAuth")



router.post("/",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,news.addNewsData,sendEmailToSubscribers)
router.get("/",news.getNewsData);
router.get("/get/:id",news.getNewsDataById);
router.put("/:id",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,news.updateNewsData,sendEmailToSubscribers)
router.delete("/:id",verifyToken,verifyAdmin,news.deleteNewsData)

module.exports = router;
