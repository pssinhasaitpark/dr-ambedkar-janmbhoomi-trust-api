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




// const mongoose = require("mongoose");

// const newsDetailSchema = new mongoose.Schema({
//   latest_news: { type: String, required: true },
//   description: { type: String, required: true },
//   headline: { type: String, required: true },
//   image: { type: [String] },  
// });

// const newsSchema = new mongoose.Schema(
//   {
//     banner_image: { type: [String] },  
//     title: { type: String, required: false },  
//     news_details: [newsDetailSchema],  
//   },
//   { timestamps: true } 
// );

// module.exports = mongoose.model("News", newsSchema);









// const mongoose = require("mongoose");
// const newsSchema = new mongoose.Schema({
//   banner_image: [String],
//   title: { type: String, required: true },

//   latest_news: { type: String, required: true },
//   headline: { type: String, required: true },
//   description: { type: String, required: true },
//   image:[String]
// },
//   {
//     timestamps: true,
//   });

// module.exports = mongoose.model("news", newsSchema);

