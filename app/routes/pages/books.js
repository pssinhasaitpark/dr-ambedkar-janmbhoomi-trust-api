const express = require('express');
const router = express.Router();
const { books } = require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');


router.post("/", upload, convertImagesToWebP, books.addBookDetails, sendEmailToSubscribers)
router.get("/", books.getBooksData);
router.get("/get/:id", books.getBooksById);
router.put("/:id", upload, convertImagesToWebP, books.updateBookDetails, sendEmailToSubscribers)
router.delete("/:id", books.deleteBookDetails)

module.exports = router;
