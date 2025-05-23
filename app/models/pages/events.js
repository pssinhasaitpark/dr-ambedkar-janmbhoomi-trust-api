const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("events", eventsSchema);



