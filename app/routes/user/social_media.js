const express = require("express");
const router = express.Router();
const {social_media}=require("../../controllers")
const {  verifyToken,verifyAdmin } = require("../../middlewares/jwtAuth");
const { uploadMultiple,convertImagesToWebPMultiple } = require('../../middlewares/fileUploader'); 



router.post("/", verifyToken, verifyAdmin,uploadMultiple, convertImagesToWebPMultiple, social_media.createSocialMedia); 
router.get("/", social_media.getSocialMedia); 
router.delete("/:id",verifyToken, verifyAdmin, social_media.deleteSocialMedia); 
router.put("/:id", verifyToken,verifyAdmin ,uploadMultiple, convertImagesToWebPMultiple,verifyAdmin, social_media.updateSocialMedia)
module.exports = router;







