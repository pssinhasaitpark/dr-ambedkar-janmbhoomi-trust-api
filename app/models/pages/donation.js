const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("donation", donationSchema);










// const mongoose = require('mongoose');
// const donationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   title: { type: String, required: true },
//   descriptionFileId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'GridFSFile',  // Reference to GridFSFile
//     required: false,  // Optional
//   },
//   images: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'GridFSFile',  // Reference to GridFSFile
//   }],
// });

// module.exports = mongoose.model('Donation', donationSchema);












































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
