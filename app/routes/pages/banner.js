const express = require('express');
const router = express.Router();
const {banner}=require("../../controllers")
const{verifyToken,verifyAdmin}=require("../../middlewares/jwtAuth")
const { imageConversionMiddlewareMultiple} = require('../../middlewares/upload'); 



  router.post("/add",verifyToken,verifyAdmin, imageConversionMiddlewareMultiple,banner.createBanner);
  router.get("/getAll",banner.getAllBanners);
  router.get("/:id",banner.getBannerById);
  router.put("/:id",verifyToken,verifyAdmin,imageConversionMiddlewareMultiple,banner.updateBanner);
  router.delete("/:id",verifyToken,verifyAdmin,banner.deleteBanner)

module.exports = router;
