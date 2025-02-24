const express = require('express');
const router = express.Router();
const {biography}=require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



// router.post("/add",upload,convertImagesToWebP,biography.createBiography,sendEmailToSubscribers)
router.get("",biography.getBiographyData)
router.get("/get/:id",biography.getBiographyById);
// router.put("/update/:id",upload,convertImagesToWebP,biography.updateBiography,sendEmailToSubscribers)
router.delete("/delete/:id",biography.deleteBiography)

module.exports = router;
