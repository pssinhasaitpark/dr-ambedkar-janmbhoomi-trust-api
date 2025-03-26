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

    // if (req.files && req.files.length > 0) {
    //   const uploadPromises = req.files.map((file) =>
    //     cloudinary.uploadImageToCloudinary(file.buffer)  
    //   );
    //   const newImageUrls = await Promise.all(uploadPromises);
    //   imageUrls.push(...newImageUrls);  
    // }




    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
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

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    if (!id) {
      return handleResponse(res, 400, "Please provide an ID");
    }

    const data = await News.findById(id);

    if (!data) {
      return handleResponse(res, 404, "Data not found with the provided ID");
    }

    return handleResponse(res, 200, "Data retrieved successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error retrieving data", error.message);
  }
};

exports.updateNewsData = async (req, res, next) => {

  const { error } = newsSchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
  }


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

    // if (req.files && req.files.length > 0) {
    //   const uploadPromises = req.files.map((file) =>
    //     cloudinary.uploadImageToCloudinary(file.buffer)  
    //   );
    //   const newImageUrls = await Promise.all(uploadPromises);
    //   imageUrls.push(...newImageUrls);  
    // }

    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
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
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    const data = await News.findByIdAndDelete(id);
    if (!data) {
      return handleResponse(res, 404, "Data not found");
    }
    return handleResponse(res, 200, "News details deleted successfully", data);
  } catch (error) {
    return handleResponse(res, 500, "Error deleting News details", error.message);
  }
};
