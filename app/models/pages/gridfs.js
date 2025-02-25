const mongoose = require('mongoose');

// Define the schema for GridFS files (this will map to the fs.files collection)
const gridFSFileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  uploadDate: Date,
  chunkSize: Number,
  md5: String,
}, { collection: 'uploads.files' }); // The collection name is 'fs.files' by default

// Create the model
const GridFSFile = mongoose.model('GridFSFile', gridFSFileSchema);
module.exports = GridFSFile;

