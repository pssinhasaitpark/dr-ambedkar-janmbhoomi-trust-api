const { handleResponse } = require("../../utils/helper");
const { News } = require("../../models");
const { validationSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.addNewsData = async (req, res, next) => {
  try {


console.log("req.body=========================",req.body)

    const { title, news_details } = req.body;
    const { id } = req.query.id ? req.query : req.body; 

console.log("news_details========",news_details);

    let existingNews = null;
    if (id) {
      existingNews = await News.findById(id);  
    }

     let imageUrls = existingNews ? [...existingNews.banner_image] : [];
 

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer) 
      );
      const newImageUrls = await Promise.all(uploadPromises);
      imageUrls.push(...newImageUrls); 
    }
    

    const data = {
      title,
      banner_image: imageUrls,
      news_details: Array.isArray(news_details)
        ? news_details.map(detail => ({
            latest_news: detail.latest_news,
            headline: detail.headline,
            description: detail.description,
            image: detail.image,
          }))
        : [],
    };

    let newNews;
    if (existingNews) {
      existingNews.set(data); 
      newNews = await existingNews.save();  
      req.event = newNews;  
      next();  

      return handleResponse(res, 200, "News updated successfully!", newNews);
    } else {
      newNews = new News(data);
      await newNews.save();  
      req.event = newNews;  
      next();  

      return handleResponse(res, 201, "News details added successfully!", newNews);
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error in adding or updating news details", error.message);
  }
};


// exports.addNewsData = async (req, res, next) => {
//   try {
//     const { error } = validationSchema.validate(req.body);
//     if (error) {
//       return handleResponse(res, 400, error.details[0].message);
//     }

//     const { title, news_details } = req.body;
//     const { id } = req.query.id ? req.query : req.body;

//     let existingNews = null;
//     if (id) {
//       existingNews = await News.findById(id);  
//     }

//     let removeImages = [];
//     if (req.body.removeImages) {
//       try {
//         removeImages = JSON.parse(req.body.removeImages);  
//       } catch (error) {
//         return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
//       }
//     }


//     let imageUrls = existingNews ? [...existingNews.banner_image] : [];


//     if (Array.isArray(removeImages)) {
//       imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
//     }

  
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) =>
//         cloudinary.uploadImageToCloudinary(file.buffer)  
//       );
//       const newImageUrls = await Promise.all(uploadPromises);
//       imageUrls.push(...newImageUrls); 
//     }

   
//     const data = {
//       title, 
//       banner_image: imageUrls, 
//       news_details: news_details.map(detail => ({
//         latest_news: detail.latest_news,  
//         headline: detail.headline,  
//         description: detail.description,  
//         image: detail.image,  
//       })),
//     };

//     let newNews;
//     if (existingNews) {
     
//       existingNews.set(data);
//       newNews = await existingNews.save();
//       req.event = newNews;  
//       next();

//       return handleResponse(res, 200, "News updated successfully!", newNews);
//     } else {
    
//       newNews = new News(data);
//       await newNews.save();
//       req.event = newNews;  
//       next();

//       return handleResponse(res, 201, "News details added successfully!", newNews);
//     }
//   } catch (error) {
//     console.error(error);
//     return handleResponse(res, 500, "Error in adding or updating news details", error.message);
//   }
// };





// exports.addNewsData = async (req, res, next) => {
//     try {
//       const { error } = validationSchema.validate(req.body);
//       if (error) {
//         return handleResponse(res, 400, error.details[0].message);
//       }
  
//       const { title, name, description } = req.body; 
//       const { id } = req.query.id ? req.query : req.body;  
  
//       let existingNews = null;
//       if (id) {
//         existingNews = await News.findById(id);  
//       }
  
      
//       let removeImages = [];
//       if (req.body.removeImages) {
//         try {
//           removeImages = JSON.parse(req.body.removeImages);  
//         } catch (error) {
//           return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
//         }
//       }
  
//       let imageUrls = existingNews ? [...existingNews.images] : [];  
  
//       if (Array.isArray(removeImages)) {
//         imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
//       }
  
//       if (req.files && req.files.length > 0) {
//         const uploadPromises = req.files.map((file) =>
//           cloudinary.uploadImageToCloudinary(file.buffer)  
//         );
//         const newImageUrls = await Promise.all(uploadPromises);
//         imageUrls.push(...newImageUrls);  
//       }
  
     
//       const data = {
//         name,
//         title,
//         description,
//         images: imageUrls,  
//       };
  
//       let newNews;
//       if (existingNews) {
        
//         existingNews.set(data);
//         newNews = await existingNews.save();
//         req.event = newNews;  
//         next();
  
//         return handleResponse(res, 200, "News updated successfully!", newNews);
//       } else {

//         newNews = new News(data);
//         await newNews.save();
//         req.event = newNews;  
//         next();
  
//         return handleResponse(res, 201, "News details added successfully!", newNews);
//       }
//     } catch (error) {
//       console.error(error);
//       return handleResponse(res, 500, "Error in adding or updating news details", error.message);
//     }
//   };
  

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

exports.updateNewsData = async (req, res,next) => {
    const { id } = req.params;
    const { title, name, description } = req.body;

    try {
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)
            );
            imageUrls = await Promise.all(uploadPromises);
        }

        const updatedNews = await News.findByIdAndUpdate(
            id,
            {
                title,
                name,
                description,
                images: imageUrls,
            },
            { new: true }
        );

        if (!updatedNews) {
            return handleResponse(res, 404, 'News data not found.');
        }
        req.event=updatedNews;
        next();

        return handleResponse(res, 200, 'Data updated successfully.', updatedNews);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Error updating news details', error.message);
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
