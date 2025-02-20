const express = require('express');
const router = express.Router();
const {gallery}=require("../../controllers")
const { upload,convertImagesToWebP ,uploadMultiple,convertImagesToWebPMultiple} = require('../../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



router.post("/",uploadMultiple,convertImagesToWebPMultiple,gallery.addGallery,sendEmailToSubscribers)
router.get("/",gallery.getGalleryData);
router.get("/get/:id",gallery.getGalleryDataById);
router.put("/:id",uploadMultiple,convertImagesToWebPMultiple,gallery.updateGalleryData,sendEmailToSubscribers)
router.delete("/:id",gallery.deleteGalleryData)

module.exports = router;
