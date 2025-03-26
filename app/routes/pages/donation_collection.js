const express = require('express');
const router = express.Router();
const { donation_collection } = require("../../controllers")
const { imageConversionMiddlewareMultiple } = require('../../middlewares/upload'); 




router.post("/", imageConversionMiddlewareMultiple, donation_collection.collectDonation)
router.get("/", donation_collection.getCollectDonationData)
router.get("/:id", donation_collection.getCollectDonationDataById);
router.put("/:id", imageConversionMiddlewareMultiple, donation_collection.updateDonationDetails)
router.delete("/:id", donation_collection.deleteDonationDetails)
router.post("/verify-payment", donation_collection.verifyPayment)

module.exports = router;
