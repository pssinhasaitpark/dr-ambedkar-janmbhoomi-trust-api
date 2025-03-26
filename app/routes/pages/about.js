const express = require('express');
const router = express.Router();
const {biography}=require("../../controllers")
const{imageConversionMiddlewareMultiple}=require("../../middlewares/upload")
const{verifyToken,verifyAdmin}=require("../../middlewares/jwtAuth")
const {sendEmailToSubscribers}= require('../../middlewares/sendemailTosubscriber');



router.post("/add",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,biography.createBiography,sendEmailToSubscribers)
router.get("",biography.getBiographyData)
router.get("/get/:id",biography.getBiographyById);
router.put("/update/:id",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,biography.updateBiography)
router.delete("/delete/:id",verifyToken,verifyAdmin,biography.deleteBiography)

module.exports = router;
