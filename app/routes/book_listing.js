const express = require('express');
const router = express.Router();
const {book_listing}=require("../controllers")
const { uploadSingle,convertSingleImageToWebP } = require('../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../middlewares/sendemailTosubscriber');



router.post("/",uploadSingle,convertSingleImageToWebP,book_listing.addBookDetails)
router.get("/",book_listing.getBooksData);
router.get("/:id",book_listing.getBooksById);
router.put("/:id",uploadSingle,convertSingleImageToWebP,book_listing.updateBookDetails)
router.delete("/:id",book_listing.deleteBookDetails)

module.exports = router;
