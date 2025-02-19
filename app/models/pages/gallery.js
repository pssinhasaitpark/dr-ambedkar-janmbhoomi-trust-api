const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    short_description: { type: String, required: true },
    long_description: { type: String, required: true },
    images:[String]
},
    {
        timestamps: true,
    });

module.exports = mongoose.model("gallery", gallerySchema);
