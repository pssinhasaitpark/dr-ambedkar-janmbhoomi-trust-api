const express = require('express');
const router = express.Router();
const {events}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 


router.post("/",upload,convertImagesToWebP,events.addEvents)
router.get("/",events.getEventsData)
router.get("/:id",events.getEventsDataById);
router.put("/:id",upload,convertImagesToWebP,events.updateEvent)
router.delete("/:id",events.deleteEvent)

module.exports = router;
