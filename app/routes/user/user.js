const express = require('express');
const router = express.Router();
const { users } = require("../../controllers")
// const { uploadSingle, convertImagesToWebPMultiple, uploadMultiple, convertSingleImageToWebP } = require('../../middlewares/fileUploader');
const {imageConversionMiddlewareMultiple } = require('../../middlewares/upload');

const { verifyToken, verifyRole, verifyAdmin, verifyResetToken } = require('../../middlewares/jwtAuth');


router.post("/register", verifyToken, verifyAdmin, imageConversionMiddlewareMultiple, users.registerUser);

router.post("/login", users.loginUser, verifyRole);

router.get("/me", verifyToken, users.me);

router.put("/:id", verifyToken, verifyAdmin, imageConversionMiddlewareMultiple, users.updateUser);

router.get("/trustee", users.getTrustees);

router.get("/", verifyToken, verifyAdmin, users.getAllUsers);

router.delete("/:id", verifyToken, verifyAdmin, users.deletUserbyId)

router.post("/forgate", users.forgatePassword);

router.post("/reset-password", verifyResetToken, users.resetPassword);






router.post("/testimonials", imageConversionMiddlewareMultiple, users.testimonials);
router.get("/testimonials", users.getTestimonials);
router.delete("/testimonials/:id", users.deleteTestimonials)



module.exports = router;
