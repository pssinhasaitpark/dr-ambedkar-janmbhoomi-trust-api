const express = require('express');
const router = express.Router();
const { event_listing } = require("../../controllers")
const {  upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/", upload, convertImagesToWebP, event_listing.addWEventDetails, sendEmailToSubscribers)
router.get("/", event_listing.getEventsData)
router.get("/:id", event_listing.getEventsDataById);
router.put("/:id", upload, convertImagesToWebP, event_listing.updateEventDetails, sendEmailToSubscribers)
router.delete("/:id", event_listing.deleteEventDetails)

module.exports = router;
