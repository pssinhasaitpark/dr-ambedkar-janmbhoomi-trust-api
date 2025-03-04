const express = require('express');
const router = express.Router();
const { donation_collection } = require("../../controllers")
const { upload } = require('../../middlewares/fileUploader');



router.post("/",upload, donation_collection.collectDonation)
router.get("/", donation_collection.getCollectDonationData)
router.get("/:id", donation_collection.getCollectDonationDataById);
router.put("/:id", upload, donation_collection.updateDonationDetails)
router.delete("/:id", donation_collection.deleteDonationDetails)

module.exports = router;
