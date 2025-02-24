 const multer = require("multer");
const { uploadStream } = require("../middlewares/gridfs");
const { handleResponse } = require("../utils/helper");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
  }
  cb(null, true);
};


const upload =  multer({
  limits: { fieldSize: 500 * 1024 * 1024 }
}).array("images", 10);


const uploadFilesToGridFS = async (req, res, next) => {
  try {    

    if (!req.files || (Array.isArray(req.files) && req.files.length === 0) || (typeof req.files === 'object' && Object.keys(req.files).length === 0)) {
      return handleResponse(res, 400, "No files were uploaded.");
    }

    // Process files and upload to GridFS
    const promises = [];
    
    if (typeof req.files === 'object') {
      for (const field in req.files) {
        const files = req.files[field];
    
        // Check if the file is an array (multiple files)
        if (Array.isArray(files)) {
          // Handle multiple files
          promises.push(
            ...files.map(async (file) => {
              const fileId = await uploadStream(file.originalname, file.buffer); 
              file.fileId = fileId; 
            })
          );
        } else {
      
          promises.push(
            (async () => {
              const fileId = await uploadStream(files.originalname, files.buffer); 
              files.fileId = fileId; 
            })()
          );
        }
      }
    } else if (Array.isArray(req.files)) {
   
      promises.push(
        ...req.files.map(async (file) => {
          const fileId = await uploadStream(file.originalname, file.buffer); 
          file.fileId = fileId; 
        })
      );
    }
    
    await Promise.all(promises);
    next(); 
    
  } catch (err) {
    console.error(err);
    return handleResponse(res, 500, "Error uploading files to GridFS", err.message);
  }
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
module.exports = { uploadMultiple, uploadFilesToGridFS ,upload};






// const multer = require("multer");
// const path = require("path");
// const sharp = require("sharp");
// const { handleResponse } = require("../utils/helper");

// const storage = multer.memoryStorage();


// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//   if (!allowedTypes.includes(file.mimetype)) {
//     return cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
//   }
//   cb(null, true);
// };


// const uploadMultiple = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 },  
//   fileFilter,
// }).fields([
//   { name: "birthplace_media", maxCount: 10 },
//   { name: "events_media", maxCount: 10 },
//   { name: "exhibitions_media", maxCount: 10 },
//   { name: "online_media", maxCount: 10 },
// ]);


// const upload =  multer({
//   limits: { fieldSize: 500 * 1024 * 1024 }
// }).array("images", 10);


// const convertImagesToWebPMultiple = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return handleResponse(res, 400, "No files were uploaded.");
//     }


//     const promises = Object.keys(req.files).map(async (field) => {
     
//       const files = req.files[field];

//       for (const file of files) {
//         const webpBuffer = await sharp(file.buffer)
//           .webp()
//           .toBuffer();
        
//         file.buffer = webpBuffer;
//         file.mimetype = "image/webp";
//         file.originalname = path.parse(file.originalname).name + ".webp";
//       }
//     });

    
//     await Promise.all(promises);

//     next();
//   }
//   catch (err) {
//     console.error(err);
//     next(err); 
//   }
// };




// const convertImagesToWebP = async (req, res, next) => {
//   try {

//     if (!req.files || req.files.length === 0) {
//       return handleResponse(res, 400, "No files were uploaded.");
//     }

//     const promises = req.files.map(async (file) => {
//       const webpBuffer = await sharp(file.buffer)
//         .webp()
//         .toBuffer();
//       file.buffer = webpBuffer;
//       file.mimetype = "image/webp";
//       file.originalname = path.parse(file.originalname).name + ".webp";
//     });

//     await Promise.all(promises);
//     next();
//   } catch (err) {
//     next(err);
//   }
// };



// const convertImagesToWebP = async (req, res, next) => {
//   try {
//       if (req.files && req.files.length > 0) {
//           const promises = req.files.map(async (file) => {
//               const webpBuffer = await sharp(file.buffer)
//                   .webp()
//                   .toBuffer();
//               file.buffer = webpBuffer;
//               file.mimetype = "image/webp";
//               file.originalname = path.parse(file.originalname).name + ".webp";
//           });

//           await Promise.all(promises);
//       }

//       next();
//   } catch (err) {
//       next(err);
//   }
// };

// module.exports = { upload, convertImagesToWebP ,uploadMultiple,convertImagesToWebPMultiple};