const express = require('express');
const router = express.Router();
const { gallery } = require("../../controllers")
// const { uploadMultiple, convertImagesToWebPMultiple } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');

const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/", imageConversionMiddlewareMultiple, gallery.addGallery, sendEmailToSubscribers)
router.get("/", gallery.getGalleryData);
router.get("/get/:id", gallery.getGalleryDataById);
router.put("/:id",imageConversionMiddlewareMultiple, gallery.updateGalleryData, sendEmailToSubscribers)
router.delete("/:id", gallery.deleteGalleryData)

module.exports = router;
