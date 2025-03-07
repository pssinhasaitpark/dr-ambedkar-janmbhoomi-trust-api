const mongoose = require("mongoose");

const donationCollectionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentId: { type: String },
  orderId: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, 
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("donation_collection", donationCollectionSchema);
