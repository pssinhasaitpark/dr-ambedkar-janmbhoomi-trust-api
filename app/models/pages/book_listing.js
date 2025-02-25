const mongoose = require("mongoose");

const bookListingSchema = new mongoose.Schema({
  book_title: { type: String, required: true },
  author_name: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("book_listing_details", bookListingSchema);
