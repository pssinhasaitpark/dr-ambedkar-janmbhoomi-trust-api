
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


