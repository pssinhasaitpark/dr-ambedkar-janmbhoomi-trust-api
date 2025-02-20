const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({

    gallery_info: {
        type: String,
    },
    gallery_description: { type: String },
    birthplace_media: [String],
    events_media: [String],
    exhibitions_media: [String],
    online_media: [String],
    birthplace_media_indexes:{type:Number}

},
    {
        timestamps: true,
    });

module.exports = mongoose.model("gallery", gallerySchema);
