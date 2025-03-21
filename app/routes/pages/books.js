const express = require('express');
const router = express.Router();
const { books } = require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');

const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');


router.post("/",imageConversionMiddlewareMultiple, books.addBookDetails, sendEmailToSubscribers)
router.get("/", books.getBooksData);
router.get("/get/:id", books.getBooksById);
router.put("/:id", imageConversionMiddlewareMultiple, books.updateBookDetails, sendEmailToSubscribers)
router.delete("/:id", books.deleteBookDetails)

module.exports = router;
