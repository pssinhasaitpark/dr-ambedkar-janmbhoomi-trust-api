const express = require('express');
const router = express.Router();
const {donation}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



router.post("/",upload,convertImagesToWebP,donation.addDonationData,sendEmailToSubscribers)
router.get("/",donation.getDonationData);
router.get("/get/:id",donation.getDonationDataById);
router.put("/:id",upload,convertImagesToWebP,donation.updateDonationData,sendEmailToSubscribers)
router.delete("/:id",donation.deleteDonationData)

module.exports = router;
