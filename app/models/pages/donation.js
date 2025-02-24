// const mongoose = require("mongoose");

// const donationSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   images: [String],
// },
//   {
//     timestamps: true,
//   });

// module.exports = mongoose.model("donation", donationSchema);


const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Remove the 'description' field as required and add a 'descriptionFileId' field
  descriptionFileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GridFSFile',  // Reference to the GridFS file collection
    required: false,  // Make it optional
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GridFSFile',
  }],
});

module.exports = mongoose.model('Donation', donationSchema);












































// const mongoose = require("mongoose");

// const donationSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     images: [{ type: mongoose.Schema.Types.ObjectId, ref: "fs.files" }], // GridFS reference
//descriptionFileId: { type: mongoose.Schema.Types.ObjectId, ref: "GridFSFile" }, // Store the GridFS file ID
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Donation", donationSchema);
