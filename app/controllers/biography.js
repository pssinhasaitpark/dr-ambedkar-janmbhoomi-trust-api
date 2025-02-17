const { successResponse, errorResponse } = require("../utils/helper");
const { Biography } = require("../models");
const { biographySchema } = require("./vailidators/validaters");
const cloudinary = require("../utils/cloudinaryConfig");


exports.createBiography=async(req,res) =>{
  try{
  const {title,name,biography}=req.body;
  
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }
  
   const data = {
    name,
    title,
    biography,
    image_urls: imageUrls,
  };

  const newBiography = new Biography(data);
  await newBiography.save();

  successResponse(
    res,
    "Biography created successfully!",
    newBiography,
    201
  );
} catch (error) {
  console.error(error);
  errorResponse(res, "Error creating biography", 500, error.message);
}

};

exports.getBiographyData = async (req, res) => {
  try {
    const data = await Biography.find();
    successResponse(res, "Biography data fetched successfully!",data, 200);
  } catch (error) {
    errorResponse(res, "Error fetching biography data", 500, error.message);
  }
};

exports.getBiographyById = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "please provide id", 404);
    }
    const data = await Biography.findById(req.params.id);

    if (!data) {
      return errorResponse(res, "Biography not found with provided id", 404);
    }
    successResponse(
      res,
      "Biography data retrieved successfully!",
       data ,
      200
    );
  } catch (error) {
    errorResponse(res, "Error retrieving biography data", 500, error.message);
  }
};

exports.updateBiography = async (req, res) => {
  try {
    const data = await Biography.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return errorResponse(res, "Biography not found", 404);
    }
    successResponse(res, "Biography updated successfully", data, 200);
  } catch (error) {
    errorResponse(res, "Error updating biography data", 400, error.message);
  }
};

exports.deleteBiography = async (req, res) => {
  try {
    const data = await Biography.findByIdAndDelete(req.params.id);
    if (!data) {
      return errorResponse(res, "Biography not found", 404);
    }
    successResponse(res, "Biography deleted successfully", {}, 200);
  } catch (error) {
    errorResponse(res, "Error deleting biography data", 500, error.message);
  }
};

