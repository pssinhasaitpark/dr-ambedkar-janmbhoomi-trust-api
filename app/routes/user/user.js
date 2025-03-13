const express = require('express');
const router = express.Router();
const { users } = require("../../controllers")
const { uploadSingle, convertImagesToWebPMultiple, uploadMultiple, convertSingleImageToWebP } = require('../../middlewares/fileUploader');
const { verifyToken, verifyRole, verifyAdmin, verifyResetToken } = require('../../middlewares/jwtAuth');


router.post("/register", verifyToken, verifyAdmin, uploadSingle, convertSingleImageToWebP, users.registerUser);

router.post("/login", users.loginUser, verifyRole);

router.get("/me", verifyToken, users.me);

router.put("/:id", verifyToken, verifyAdmin, uploadSingle, users.updateUser);

router.get("/trustee", users.getTrustees);

router.get("/", verifyToken, verifyAdmin, users.getAllUsers);

router.delete("/:id", verifyToken, verifyAdmin, users.deletUserbyId)

router.post("/forgate", users.forgatePassword);

router.post("/reset-password", verifyResetToken, users.resetPassword);






router.post("/testimonials", uploadMultiple, convertImagesToWebPMultiple, users.testimonials);
router.get("/testimonials", users.getTestimonials);
router.delete("/testimonials/:id", users.deleteTestimonials)



module.exports = router;
