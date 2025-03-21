const express = require('express');
const router = express.Router();
const { donation } = require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');

const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/", imageConversionMiddlewareMultiple, donation.addDonationData, sendEmailToSubscribers)
router.get("/", donation.getDonationData);
router.get("/get/:id", donation.getDonationDataById);
router.put("/:id",imageConversionMiddlewareMultiple,donation.updateDonationData,sendEmailToSubscribers)
router.delete("/:id", donation.deleteDonationData)
module.exports = router;
