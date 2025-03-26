const express = require('express');
const router = express.Router();
const { events } = require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');
const{verifyToken,verifyAdmin}=require("../../middlewares/jwtAuth")
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/",verifyToken,verifyAdmin, imageConversionMiddlewareMultiple, events.addEvents, sendEmailToSubscribers)
router.get("/", events.getEventsData)
router.get("/:id", events.getEventsDataById);
router.put("/:id", verifyToken,verifyAdmin,imageConversionMiddlewareMultiple, events.updateEvent, sendEmailToSubscribers)
router.delete("/:id", verifyToken,verifyAdmin,events.deleteEvent)

module.exports = router;
