const mongoose = require("mongoose");

const biographySchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  biography: { type: String, required: true },
  images: [String],
},
{
  timestamps: true,
});

module.exports = mongoose.model("biography", biographySchema);



