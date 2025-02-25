const express = require('express');
const router = express.Router();
const {events}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



router.post("/",upload,convertImagesToWebP,events.addEvents,sendEmailToSubscribers)
router.get("/",events.getEventsData)
router.get("/:id",events.getEventsDataById);
 router.put("/:id",upload,convertImagesToWebP,events.updateEvent,sendEmailToSubscribers)
router.delete("/:id",events.deleteEvent)

module.exports = router;
