const express = require('express');
const router = express.Router();
const {users}=require("../../controllers")
//const { upload, convertImagesToWebP } = require('../../middlewares/fileUploader'); 
const { verifyUser,verifyRole} = require('../../middlewares/jwtAuth');


  router.post("/register", users.registerUser);
  router.post("/login", users.loginUser, verifyRole);
  router.get("/me",verifyUser,users.me);
  router.put("/update",verifyUser,users.updateUser);
  
  // router.post("/testimonials",upload,convertImagesToWebP,users.testimonials);
  router.get("/testimonials/show",users.showTestimonials);
  router.get("/testimonials",users.getTestimonials);



module.exports = router;
