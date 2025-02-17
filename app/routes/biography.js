const express = require('express');
const router = express.Router();
const {biography}=require("../controllers")
const { upload, convertImagesToWebP } = require('../utils/fileUploader'); 

router.post("/add",upload,convertImagesToWebP,biography.createBiography)
router.get("/getAll",biography.getBiographyData)
router.get("/get/:id",biography.getBiographyById);
router.put("/update",biography.updateBiography)
router.delete("/delete/:id",biography.deleteBiography)

module.exports = router;
