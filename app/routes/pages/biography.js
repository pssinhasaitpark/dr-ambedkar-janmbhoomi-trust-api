const express = require('express');
const router = express.Router();
const {biography}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 


router.post("/add",upload,convertImagesToWebP,biography.createBiography)
router.get("",biography.getBiographyData)
router.get("/get/:id",biography.getBiographyById);
router.put("/update/:id",upload,convertImagesToWebP,biography.updateBiography)
router.delete("/delete/:id",biography.deleteBiography)

module.exports = router;
