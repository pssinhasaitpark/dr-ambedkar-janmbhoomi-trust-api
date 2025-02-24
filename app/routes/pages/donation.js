const express = require('express');
const router = express.Router();
const { donation } = require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const { uploadFilesToGridFS ,upload} = require('../../middlewares/fileUploader');
const { uploadToGridFS } = require('../../middlewares/gridfs');
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



// router.post("/", upload,uploadToGridFS, donation.addDonationData, sendEmailToSubscribers)
 router.post("/",upload,uploadFilesToGridFS,donation.addDonationData)

router.get("/", donation.getDonationData);
router.get("/get/:id", donation.getDonationDataById);
// router.put("/:id",upload,convertImagesToWebP,donation.updateDonationData,sendEmailToSubscribers)
router.delete("/:id", donation.deleteDonationData)

module.exports = router;
