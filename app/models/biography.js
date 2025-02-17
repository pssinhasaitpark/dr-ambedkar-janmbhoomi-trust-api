const mongoose = require("mongoose");


const biographySchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  biography: { type: String, required: true },
  image_urls: [String],  
});

module.exports = mongoose.model("biography", biographySchema);
