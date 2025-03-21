const express = require('express');
const router = express.Router();
const { events } = require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');

const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');



router.post("/", imageConversionMiddlewareMultiple, events.addEvents, sendEmailToSubscribers)
router.get("/", events.getEventsData)
router.get("/:id", events.getEventsDataById);
router.put("/:id", imageConversionMiddlewareMultiple, events.updateEvent, sendEmailToSubscribers)
router.delete("/:id", events.deleteEvent)

module.exports = router;
