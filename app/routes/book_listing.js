const express = require('express');
const router = express.Router();
const {book_listing}=require("../controllers")
// const { convertSingleImageToWebP,uploadMultiple,convertImagesToWebPMultiple } = require('../middlewares/fileUploader'); 
const {imageConversionMiddlewareMultiple } = require('../middlewares/upload'); 
const {sendEmailToSubscribers}= require('../middlewares/sendemailTosubscriber');
const {  verifyToken,verifyAdmin } = require("../middlewares/jwtAuth");


router.post("/",imageConversionMiddlewareMultiple,book_listing.addBookDetails)
router.get("/",book_listing.getBooksData);
router.get("/:id",book_listing.getBooksById);
router.put("/:id",imageConversionMiddlewareMultiple,book_listing.updateBookDetails)
router.delete("/:id",book_listing.deleteBookDetails)

module.exports = router;
