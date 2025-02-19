const mongoose = require("mongoose");

const biographySchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  biography: { type: String, required: true },
  image_urls: [String],
  // short_description: { type: String, required: true },
// born_details: { type: String, required: true },
// death_details: { type: String, required: true },
// awards: { type: String, required: true },
// achievements: { type: String, required: true },
},
{
  timestamps: true,
});

module.exports = mongoose.model("biography", biographySchema);



