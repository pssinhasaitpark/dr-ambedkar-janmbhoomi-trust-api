const { handleResponse } = require("../../utils/helper");
const { News } = require("../../models");
const { newsSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");
const mongoose = require('mongoose');



exports.addNewsData = async (req, res, next) => {
    try {
      const { error } = newsSchema.validate(req.body);
      if (error) {
        return handleResponse(res, 400, error.details[0].message);
      }
  
      const { latest_news, headline, description } = req.body; 
      const { id } = req.query.id ? req.query : req.body;  
  
      let existingNews = null;
      if (id) {
        existingNews = await News.findById(id);  
      }
  
      
      let removeImages = [];
      if (req.body.removeImages) {
        try {
          removeImages = JSON.parse(req.body.removeImages);  
        } catch (error) {
          return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
        }
      }
  
      let imageUrls = existingNews ? [...existingNews.images] : [];  
  
      if (Array.isArray(removeImages)) {
        imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
      }
  
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          cloudinary.uploadImageToCloudinary(file.buffer)  
        );
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls.push(...newImageUrls);  
      }
  
     
      const data = {
        latest_news,
        headline,
        description,
        images: imageUrls,  
      };
  
     

        newNews = new News(data);
        await newNews.save();
        req.event = newNews;  
        next();
  
        return handleResponse(res, 201, "News details added successfully!", newNews);
      
    } catch (error) {
      console.error(error);
      return handleResponse(res, 500, "Error in adding or updating news details", error.message);
    }
  };
  

// exports.addNewsData = async (req, res) => {
//     try {
//         const { title, news_details } = req.body;
//         const { id } = req.query.id ? req.query : req.body;

//         let parsedNewsDetails = [];
//         if (typeof news_details === "string") {
//             try {
//                 parsedNewsDetails = JSON.parse(news_details); 
//             } catch (error) {
//                 console.error('Error parsing news_details:', error);
//                 return res.status(400).json({ error: "Invalid news_details format. Must be a JSON array." });
//             }
//         } else if (Array.isArray(news_details)) {
//             parsedNewsDetails = news_details; 
//         }

//         let existingNews = null;
//         if (id) {
//             existingNews = await News.findById(id);
//         }

//         let imageUrls = existingNews ? [...existingNews.banner_image] : [];
//         let imagesUrls = existingNews ? [...existingNews.images] : [];


//         if (req.files) {
//             if (req.files.banner_image && req.files.banner_image.length > 0) {
//                 const bannerUploadPromises = req.files.banner_image.map((file) =>
//                     cloudinary.uploadImageToCloudinary(file.buffer) 
//                 );
//                 const bannerImageUrls = await Promise.all(bannerUploadPromises);
//                 imageUrls.push(...bannerImageUrls);
//             }
//             console.log("req.files.images===",req.files.images);
//             console.log("req.files.images.length===",req.files.images.length);

            

//             if (req.files.images && req.files.images.length > 0) {
//                 const imageUploadPromises = req.files.images.map((file) =>
//                     cloudinary.uploadImageToCloudinary(file.buffer)
//                 );
//                 const imageUrlsFromImages = await Promise.all(imageUploadPromises);
//                 imagesUrls.push(...imageUrlsFromImages);
//             }
//             console.log("imagesUrls====",imagesUrls);
            
//         }

//         // Process the news_details to ensure it has the correct format
//         const processedNewsDetails = parsedNewsDetails.map((detail) => ({
//             latest_news: detail.latest_news,
//             headline: detail.headline,
//             description: detail.description,
//             image: imagesUrls
//         }));
//         console.log("processedNewsDetails==",processedNewsDetails);
        

//         // Prepare the data for saving or updating
//         const data = {
//             title,
//             banner_image: imageUrls, // Banner images should be an array
//             news_details: processedNewsDetails,
//         };

//         let newNews;
//         if (existingNews) {
//             // Update existing news
//             existingNews.set(data); 
//             newNews = await existingNews.save();
//             return res.status(200).json({ message: "News updated successfully!", newNews });
//         } else {
//             // Create new news
//             newNews = new News(data); 
//             await newNews.save();
//             return res.status(201).json({ message: "News details added successfully!", newNews });
//         }
//     } catch (error) {
//         console.error("Error in adding or updating news:", error);
//         return res.status(500).json({ error: "Error in adding or updating news details", message: error.message });
//     }
// };



exports.getNewsData = async (req, res) => {
    try {
        const data = await News.find().sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No news data available in the database");
        }

        return handleResponse(res, 200, "All News and update details fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching News and update details", error.message);
    }
};

exports.getNewsDataById = async (req, res) => {
    try {
        if (!req.params.id) {
            return handleResponse(res, 400, "Please provide an ID");
        }

        const data = await News.findById(req.params.id);

        if (!data) {
            return handleResponse(res, 404, "Data not found with the provided ID");
        }

        return handleResponse(res, 200, "Data retrieved successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error retrieving data", error.message);
    }
};

// exports.updateNewsData = async (req, res, next) => {
//     const { newsId, detailId } = req.params;
//     const { title, name, description } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(newsId) || !mongoose.Types.ObjectId.isValid(detailId)) {
//         return res.status(400).json({ message: "Invalid ID format." });
//     }

//     try {
//         const news = await News.findById(newsId);
//         if (!news) {
//             return res.status(404).json({ message: "News not found." });
//         }

        
//         const details = news.news_details.id(detailId);
//         if (!details) {
//             return res.status(404).json({ message: "News Detail not found." });
//         }
//         console.log("details.latest_news======",details.latest_news);
//         console.log("details.headline======",details.headline);
//         console.log("details.description======",details.description);

        
        

//          details.latest_news = title;
//          details.headline = name;
//         details.description = description;

//         let imageUrls = [];
//         if (req.files && req.files.length > 0) {
//             const uploadPromises = req.files.map((file) =>
//                 cloudinary.uploadImageToCloudinary(file.buffer)
//             );
//             imageUrls = await Promise.all(uploadPromises);
//         }

//         // Update the images for the detail
//         if (imageUrls.length > 0) {
//             details.image = imageUrls;
//         }

//         // Save the updated news document
//         await news.save();

//         req.event = news;
//         next();

//         return res.status(200).json({ message: "News detail updated successfully.", updatedNews: news });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error updating news details', error: error.message });
//     }
// };


exports.updateNewsData = async (req, res, next) => {

    const { error } = newsSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }
    const { id } = req.params;
    try {
        const { latest_news, headline, description } = req.body;


         let existingNews = null;
            if (id) {
                existingNews = await News.findById(id);
              if (!existingNews) {
                return handleResponse(res, 404, "News not found with provided id");
              }
            }


            let removeImages = [];
            if (req.body.removeImages) {
              try {
                removeImages = JSON.parse(req.body.removeImages);  
              } catch (error) {
                return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
              }
            }
        
            let imageUrls = existingNews ? [...existingNews.images] : [];  
        
            if (Array.isArray(removeImages)) {
              imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
            }
        
            if (req.files && req.files.length > 0) {
              const uploadPromises = req.files.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)  
              );
              const newImageUrls = await Promise.all(uploadPromises);
              imageUrls.push(...newImageUrls);  
            }
   

        const updatedNews = await News.findByIdAndUpdate(
            id,
            {
                latest_news,
                headline,
                description,
                images: imageUrls,
            },
            { new: true }
        );

        if (!updatedNews) {
            return handleResponse(res, 404, "News not found.");
        }
        req.event = updatedNews;
        next();
     
        return handleResponse(res, 200, "News details updated successfully.", updatedNews);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error updating news details data", error.message);
    }
};


exports.deleteNewsData = async (req, res) => {
    try {
        const data = await News.findByIdAndDelete(req.params.id);
        if (!data) {
            return handleResponse(res, 404, "Data not found");
        }
        return handleResponse(res, 200, "News details deleted successfully", { data });
    } catch (error) {
        return handleResponse(res, 500, "Error deleting News details", error.message);
    }
};
