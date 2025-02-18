const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image_urls: [String],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("donation", donationSchema);



