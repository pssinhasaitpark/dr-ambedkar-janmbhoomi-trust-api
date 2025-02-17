const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  book_details: { type: String, required: true },
  image_urls: [String],  
});

module.exports = mongoose.model("book_details", bookSchema);
