const express = require('express');
const router = express.Router();
const {newsletter}=require("../../controllers")
const { imageConversionMiddlewareMultiple } = require('../../middlewares/upload'); 


router.post("/",imageConversionMiddlewareMultiple,newsletter.subscribe)
router.get('/', newsletter.getAllSubscriptions);
router.put("/:id",newsletter.updateStatus)

module.exports = router;
