const express = require('express');
const router = express.Router();
const {book_listing}=require("../controllers")
const { upload, convertImagesToWebP } = require('../middlewares/fileUploader'); 
const {sendEmailToSubscribers}= require('../middlewares/sendemailTosubscriber');



router.post("/",upload,convertImagesToWebP,book_listing.addBookDetails)
router.get("/",book_listing.getBooksData);
router.get("/:id",book_listing.getBooksById);
router.put("/:id",upload,convertImagesToWebP,book_listing.updateBookDetails)
router.delete("/:id",book_listing.deleteBookDetails)

module.exports = router;
