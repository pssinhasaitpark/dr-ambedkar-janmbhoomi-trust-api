

const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { handleResponse } = require("../utils/helper");

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
  }
  cb(null, true);
};


const uploadMultiple = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },  
  fileFilter,
}).fields([
  { name: "birthplace_media", maxCount: 10 },
  { name: "events_media", maxCount: 10 },
  { name: "exhibitions_media", maxCount: 10 },
  { name: "online_media", maxCount: 10 },
]);


const upload =  multer({
  limits: { fieldSize: 500 * 1024 * 1024 }
}).array("images", 10);


const convertImagesToWebPMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return handleResponse(res, 400, "No files were uploaded.");
    }


    const promises = Object.keys(req.files).map(async (field) => {
     
      const files = req.files[field];

      for (const file of files) {
        const webpBuffer = await sharp(file.buffer)
          .webp()
          .toBuffer();
        
        file.buffer = webpBuffer;
        file.mimetype = "image/webp";
        file.originalname = path.parse(file.originalname).name + ".webp";
      }
    });

    
    await Promise.all(promises);

    next();
  }
  catch (err) {
    console.error(err);
    next(err); 
  }
};


const convertImagesToWebP = async (req, res, next) => {
  try {

    // if (!req.files || req.files.length === 0) {
    //   return handleResponse(res, 400, "No files were uploaded.");
    // }

    const promises = req.files.map(async (file) => {
      const webpBuffer = await sharp(file.buffer)
        .webp()
        .toBuffer();
      file.buffer = webpBuffer;
      file.mimetype = "image/webp";
      file.originalname = path.parse(file.originalname).name + ".webp";
    });

    await Promise.all(promises);
    next();
  } catch (err) {
    next(err);
  }
};

// // Handle single image upload (not an array)
const uploadSingle = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },  
  fileFilter
}).single("image"); // Accept only one file with field name 'image'

// Function to convert a single image to WebP
const convertSingleImageToWebP = async (req, res, next) => {
  try {
    if (!req.file) {
      return handleResponse(res, 400, "No file was uploaded.");
    }

    // Process the uploaded single image
    const webpBuffer = await sharp(req.file.buffer)
      .webp()
      .toBuffer();

    // Update the file with the converted WebP buffer and mime type
    req.file.buffer = webpBuffer;
    req.file.mimetype = "image/webp";
    req.file.originalname = path.parse(req.file.originalname).name + ".webp";

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = { upload, convertImagesToWebP ,uploadMultiple,convertImagesToWebPMultiple,uploadSingle,convertSingleImageToWebP};
