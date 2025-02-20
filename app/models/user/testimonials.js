const { required } = require("joi");
const mongoose = require("mongoose");


const testimonialsSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    case_studies: [String],
    isview:{type:Boolean},
},

    {
        timestamps: true
    }
)
module.exports = mongoose.model("testimonials", testimonialsSchema);
