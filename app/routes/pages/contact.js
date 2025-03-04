const express = require('express');
const router = express.Router();
const {contact}=require("../../controllers")
 const { upload } = require('../../middlewares/fileUploader'); 


router.post("/",upload,contact.addContact)
router.get("/",contact.getContactDetails);
router.get("/get/:id",contact.getContactDetailsById);
router.put("/:id",upload,contact.updateContactDetails)
router.delete("/:id",contact.deleteContactDetails)

module.exports = router;
