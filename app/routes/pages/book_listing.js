const express = require('express');
const router = express.Router();
const {book_listing}=require("../../controllers")
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload'); 
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');
const {  verifyToken,verifyAdmin } = require("../../middlewares/jwtAuth");


router.post("/",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,book_listing.addBookDetails,sendEmailToSubscribers)
router.get("/",book_listing.getBooksData);
router.get("/:id",book_listing.getBooksById);
router.put("/:id",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,book_listing.updateBookDetails,sendEmailToSubscribers)
router.delete("/:id",verifyToken,verifyAdmin,book_listing.deleteBookDetails)

module.exports = router;
