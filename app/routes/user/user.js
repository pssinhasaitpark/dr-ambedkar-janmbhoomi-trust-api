const express = require('express');
const router = express.Router();
const {users}=require("../../controllers")
const { upload, convertImagesToWebP,convertSingleImageToWebP,uploadSingle } = require('../../middlewares/fileUploader'); 
const { verifyToken,verifyRole,verifyAdmin} = require('../../middlewares/jwtAuth');


  router.post("/register",verifyToken,verifyAdmin,uploadSingle,convertSingleImageToWebP, users.registerUser);

  router.post("/login", users.loginUser, verifyRole);

  router.get("/me",verifyToken,users.me);

  router.put("/:id",verifyToken,verifyAdmin,uploadSingle,convertSingleImageToWebP,users.updateUser);

  router.get("/trustee",verifyToken,verifyAdmin,users.getTrustees);

  router.get("/",verifyToken,verifyAdmin,users.getAllUsers);

  router.delete("/:id",verifyToken,verifyAdmin,users.deletUserbyId)








  router.post("/testimonials",upload,convertImagesToWebP,users.testimonials);
  router.get("/testimonials/show",users.showTestimonials);
  router.get("/testimonials",users.getTestimonials);



module.exports = router;
