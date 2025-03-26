const express = require('express');
const router = express.Router();
const { gallery } = require("../../controllers")
// const { uploadMultiple, convertImagesToWebPMultiple } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');
const{verifyToken,verifyAdmin}=require("../../middlewares/jwtAuth")
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/", verifyToken,verifyAdmin,imageConversionMiddlewareMultiple, gallery.addGallery, sendEmailToSubscribers)
router.get("/", gallery.getGalleryData);
router.get("/get/:id", gallery.getGalleryDataById);
router.put("/:id",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple, gallery.updateGalleryData, sendEmailToSubscribers)
router.delete("/:id", verifyToken,verifyAdmin,gallery.deleteGalleryData)

module.exports = router;
