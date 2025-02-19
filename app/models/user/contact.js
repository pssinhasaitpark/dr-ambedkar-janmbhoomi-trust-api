const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_no: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true }
},
    {
        timestamps: true,
    });

module.exports = mongoose.model("contact_us", contactSchema);
