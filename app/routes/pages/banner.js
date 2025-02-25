const express = require('express');
const router = express.Router();
const {banner}=require("../../controllers")
const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 


  router.post("/add", upload, convertImagesToWebP,banner.createBanner);
  router.get("/getAll",banner.getAllBanners);
  router.get("/:id",banner.getBannerById);
  router.put("/:id",upload, convertImagesToWebP,banner.updateBanner);
  router.delete("/:id",banner.deleteBanner)

module.exports = router;
