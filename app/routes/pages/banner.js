const express = require('express');
const router = express.Router();
const {banner}=require("../../controllers")
// const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 
const { imageConversionMiddlewareMultiple} = require('../../middlewares/upload'); 



  router.post("/add", imageConversionMiddlewareMultiple,banner.createBanner);
  router.get("/getAll",banner.getAllBanners);
  router.get("/:id",banner.getBannerById);
  router.put("/:id",imageConversionMiddlewareMultiple,banner.updateBanner);
  router.delete("/:id",banner.deleteBanner)

module.exports = router;
