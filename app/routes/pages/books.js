const express = require('express');
const router = express.Router();
const { books } = require("../../controllers")
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');
const {  verifyToken,verifyAdmin } = require("../../middlewares/jwtAuth");
const { sendEmailToSubscribers } = require('../../middlewares/sendemailTosubscriber');


router.post("/",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple, books.addBookDetails, sendEmailToSubscribers)
router.get("/", books.getBooksData);
router.get("/get/:id", books.getBooksById);
router.put("/:id",verifyToken,verifyAdmin, imageConversionMiddlewareMultiple, books.updateBookDetails, sendEmailToSubscribers)
router.delete("/:id",verifyToken,verifyAdmin, books.deleteBookDetails)

module.exports = router;
