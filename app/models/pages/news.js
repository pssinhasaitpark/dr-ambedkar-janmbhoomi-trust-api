const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema({
  latest_news: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("news", newsSchema);

