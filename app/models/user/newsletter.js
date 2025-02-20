const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed'],  
    default: 'subscribed',  
  },
},
{
    timestamps:true
    
}
);

const Newsletter = mongoose.model('newsletter', newsletterSchema);

module.exports = Newsletter;
