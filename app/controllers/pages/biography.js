const { handleResponse } = require('../../utils/helper');
const { Biography } = require('../../models');
const { biographySchema } = require('../../vailidators/validaters');
const cloudinary = require("../../middlewares/cloudinaryConfig");

exports.createBiography = async (req, res) => {
  try {
    // const {title,name,biography,born_details,death_details,short_description,awards,achievements}=req.body;
    const { error } = biographySchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { title, name, biography } = req.body;

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
      // born_details,
      // death_details,
      // short_description,
      // awards,
      // achievements,
      image_urls: imageUrls,
    };

    const newBiography = new Biography(data);
    await newBiography.save();

    return handleResponse(res, 201, "Biography created successfully!", newBiography);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error creating biography", error.message);
  }
};

exports.getBiographyData = async (req, res) => {
  try {
    const data = await Biography.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return handleResponse(res, 404, "No data available in the database");
    }
    return handleResponse(res, 200, "Biography data fetched successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error fetching biography data", error.message);
  }
};

exports.getBiographyById = async (req, res) => {
  try {
    if (!req.params.id) {
      return handleResponse(res, 400, "Please provide an ID");
    }

    const data = await Biography.findById(req.params.id);

    if (!data) {
      return handleResponse(res, 404, "Biography not found with provided ID");
    }
    return handleResponse(res, 200, "Biography data retrieved successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error retrieving biography data", error.message);
  }
};

exports.updateBiography = async (req, res) => {

  
  const { error } = biographySchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }


  const { id } = req.params;
  const { title, name, biography } = req.body;

  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const updatedBiography = await Biography.findByIdAndUpdate(
      id,
      {
        title,
        name,
        biography,
        // born_details,
        // death_details,
        // short_description,
        // awards,
        // achievements,
        image_urls: imageUrls,
      },
      { new: true }
    );

    if (!updatedBiography) {
      return handleResponse(res, 404, "Biography not found.");
    }

    return handleResponse(res, 200, "Biography updated successfully.", updatedBiography);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error updating biography data", error.message);
  }
};

exports.deleteBiography = async (req, res) => {
  try {
    const data = await Biography.findByIdAndDelete(req.params.id);
    if (!data) {
      return handleResponse(res, 404, "Biography not found");
    }

    return handleResponse(res, 200, "Biography deleted successfully", {});
  } catch (error) {
    return handleResponse(res, 500, "Error deleting biography data", error.message);
  }
};
