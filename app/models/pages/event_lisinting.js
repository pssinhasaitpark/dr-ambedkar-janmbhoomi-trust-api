const mongoose = require("mongoose");

const eventListingSchema = new mongoose.Schema({
     event_title: { type: String, required: true },
     organized_by: { type: String, required: true },
     description: { type: String, required: true },
     images: [String],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("event_listing_details", eventListingSchema);
