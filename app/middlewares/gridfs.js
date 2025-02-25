const mongoose = require("mongoose");
const gridfsStream = require("gridfs-stream");
const { GridFSBucket } = require("mongodb");

const conn = mongoose.connection;

let gfs;

conn.once("open", () => {
  gfs = gridfsStream(conn.db, mongoose.mongo);
  gfs.collection("uploads"); 

  console.log("GridFS connected");
});

const MAX_FILE_SIZE = 255 * 1024 * 1024;

const uploadStream = (filename, buffer) => {
  return new Promise((resolve, reject) => {

    if (!Buffer.isBuffer(buffer)) {
      return reject(new Error("The provided buffer is not a valid Buffer."));
    }
    

    if (buffer.length > MAX_FILE_SIZE) {
      return reject(new Error("File exceeds the maximum allowed size for GridFS."));
    }

    const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
    const uploadStream = bucket.openUploadStream(filename);
    uploadStream.write(buffer);
    uploadStream.end();

    uploadStream.on("finish", () => {
      resolve(uploadStream.id.toString()); 
    });

    uploadStream.on("error", (err) => {
      console.error(`Upload error: ${err}`);
      reject(err);
    });
  });
};

const getFileStream = (fileId) => {
  const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  return bucket.openDownloadStream(mongoose.Types.ObjectId(fileId));
};

module.exports = { uploadStream, getFileStream };



//  const multer = require("multer");
// const { uploadStream } = require("../middlewares/gridfs");
// const { handleResponse } = require("../utils/helper");

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//   if (!allowedTypes.includes(file.mimetype)) {
//     return cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
//   }
//   cb(null, true);
// };


// const upload =  multer({
//   limits: { fieldSize: 500 * 1024 * 1024 }
// }).array("images", 10);


// const uploadFilesToGridFS = async (req, res, next) => {
//   try {    

//     if (!req.files || (Array.isArray(req.files) && req.files.length === 0) || (typeof req.files === 'object' && Object.keys(req.files).length === 0)) {
//       return handleResponse(res, 400, "No files were uploaded.");
//     }

//     // Process files and upload to GridFS
//     const promises = [];
    
//     if (typeof req.files === 'object') {
//       for (const field in req.files) {
//         const files = req.files[field];
    
//         // Check if the file is an array (multiple files)
//         if (Array.isArray(files)) {
//           // Handle multiple files
//           promises.push(
//             ...files.map(async (file) => {
//               const fileId = await uploadStream(file.originalname, file.buffer); 
//               file.fileId = fileId; 
//             })
//           );
//         } else {
      
//           promises.push(
//             (async () => {
//               const fileId = await uploadStream(files.originalname, files.buffer); 
//               files.fileId = fileId; 
//             })()
//           );
//         }
//       }
//     } else if (Array.isArray(req.files)) {
   
//       promises.push(
//         ...req.files.map(async (file) => {
//           const fileId = await uploadStream(file.originalname, file.buffer); 
//           file.fileId = fileId; 
//         })
//       );
//     }
    
//     await Promise.all(promises);
//     next(); 
    
//   } catch (err) {
//     console.error(err);
//     return handleResponse(res, 500, "Error uploading files to GridFS", err.message);
//   }
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
// module.exports = { uploadMultiple, uploadFilesToGridFS ,upload};




// const mongoose = require("mongoose");
// const gridfsStream = require("gridfs-stream");

// let gfs;

// const connectGridFS = (db) => {
//   gfs = gridfsStream(db, mongoose.mongo);
//   gfs.collection("uploads");  // We are going to use the "uploads" collection for GridFS files
// };

// const uploadToGridFS = (fileBuffer, filename) => {
//   return new Promise((resolve, reject) => {
//     const writeStream = gfs.createWriteStream({
//       filename: filename,
//       content_type: "application/json", // Adjust this type if needed
//     });
//     writeStream.on("close", (file) => {
//       resolve(file._id);  // This will return the file's ObjectId
//     });
//     writeStream.on("error", (error) => {
//       reject(error);
//     });
//     writeStream.write(fileBuffer);
//     writeStream.end();
//   });
// };

// const getFileFromGridFS = (fileId) => {
//   return new Promise((resolve, reject) => {
//     const readStream = gfs.createReadStream({ _id: fileId });
//     let fileData = "";
//     readStream.on("data", (chunk) => {
//       fileData += chunk;
//     });
//     readStream.on("end", () => {
//       resolve(fileData);  // return the file content
//     });
//     readStream.on("error", (error) => {
//       reject(error);
//     });
//   });
// };

// module.exports = { connectGridFS, uploadToGridFS, getFileFromGridFS };


