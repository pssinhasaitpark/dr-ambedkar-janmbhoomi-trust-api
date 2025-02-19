const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,  
    },
    heading: {
        type: String,
        required: true,
        trim: true,
    },
    beginning_date: {
        type: String,
        required: true,
        trim: true,
    },
    completion_date : {
        type: String,
        required: true,
        trim: true,
    },
    opening_date : {
        type: String,
        trim: true,
    },

    location: {
        type: String,
        required: true,
    },

    image_urls: [String],  
},
{
    timestamps: true,
});

const Banner = mongoose.model('Banner', bannerSchema); 
module.exports = Banner;
