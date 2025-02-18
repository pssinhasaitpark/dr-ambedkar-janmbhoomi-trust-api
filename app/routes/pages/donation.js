const express = require('express');
const router = express.Router();
const {donation}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 


router.post("/",upload,convertImagesToWebP,donation.addDonationData)
router.get("/",donation.getDonationData);
router.get("/get/:id",donation.getDonationDataById);
router.put("/:id",upload,convertImagesToWebP,donation.updateDonationData)
router.delete("/:id",donation.deleteDonationData)

module.exports = router;
