const express = require('express');
const router = express.Router();
const { event_listing } = require("../../controllers")
// const {  upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');
const{verifyToken,verifyAdmin}=require("../../middlewares/jwtAuth")
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/", verifyToken,verifyAdmin,imageConversionMiddlewareMultiple, event_listing.addWEventDetails, sendEmailToSubscribers)
router.get("/", event_listing.getEventsData)
router.get("/:id", event_listing.getEventsDataById);
router.put("/:id",verifyToken,verifyAdmin, imageConversionMiddlewareMultiple, event_listing.updateEventDetails, sendEmailToSubscribers)
router.delete("/:id",verifyToken,verifyAdmin, event_listing.deleteEventDetails)

module.exports = router;
