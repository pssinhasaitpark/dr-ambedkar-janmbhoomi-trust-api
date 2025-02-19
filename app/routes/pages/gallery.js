const express = require('express');
const router = express.Router();
const {gallery}=require("../../controllers")
const { upload,convertImagesToWebP } = require('../../middlewares/fileUploader'); 


router.post("/",upload,convertImagesToWebP,gallery.addGallery)
router.get("/",gallery.getGalleryData);
router.get("/get/:id",gallery.getGalleryDataById);
router.put("/:id",upload,convertImagesToWebP,gallery.updateGalleryData)
router.delete("/:id",gallery.deleteGalleryData)

module.exports = router;
