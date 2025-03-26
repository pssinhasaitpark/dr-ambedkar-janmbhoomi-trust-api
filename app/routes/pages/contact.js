const express = require('express');
const router = express.Router();
const { contact } = require("../../controllers")
const { imageConversionMiddlewareMultiple } = require('../../middlewares/upload');
const { verifyToken, verifyAdmin } = require("../../middlewares/jwtAuth")


router.post("/", imageConversionMiddlewareMultiple, contact.addContact)
router.get("/", contact.getContactDetails);
router.get("/get/:id", contact.getContactDetailsById);
router.put("/:id", imageConversionMiddlewareMultiple, contact.updateContactDetails)
router.delete("/:id", verifyToken, verifyAdmin, contact.deleteContactDetails)

module.exports = router;
