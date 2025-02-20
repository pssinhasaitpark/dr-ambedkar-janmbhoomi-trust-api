const { handleResponse } = require("../../utils/helper");
const { Donation } = require("../../models");
const { validationSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");

exports.addDonationData = async (req, res, next) => {
  try {
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { title, name, description } = req.body;

    const { id } = req.query.id ? req.query : req.body;

    let existingDonation = null;
    if (id) {
      existingDonation = await Donation.findById(id); 
    }

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
      description,
      images: imageUrls,
    };

    let newDonation;
    if (existingDonation) {
 
      existingDonation.set(data);
      newDonation = await existingDonation.save();
      req.event = newDonation; 
      next();

      return handleResponse(res, 200, "Donation details updated successfully!", newDonation);
    } else {
      
      newDonation = new Donation(data);
      await newDonation.save();
      req.event = newDonation; 
      next();

      return handleResponse(res, 201, "Donation details added successfully!", newDonation);
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error in adding or updating donation details", error.message);
  }
};

exports.getDonationData = async (req, res) => {
  try {
    const data = await Donation.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return handleResponse(res, 404, "No data available in the database");
    }
    return handleResponse(res, 200, "All Donation and Support details fetched successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error fetching donation and support details", error.message);
  }
};

exports.getDonationDataById = async (req, res) => {
  try {
    if (!req.params.id) {
      return handleResponse(res, 400, "Please provide an ID");
    }

    const data = await Donation.findById(req.params.id);

    if (!data) {
      return handleResponse(res, 404, "Data not found with provided id");
    }

    return handleResponse(res, 200, "Data retrieved successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error retrieving data", error.message);
  }
};

exports.updateDonationData = async (req, res, next) => {

  const { error } = validationSchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

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

    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      {
        title,
        name,
        description,
        images: imageUrls,
      },
      { new: true }
    );

    if (!updatedDonation) {
      return handleResponse(res, 404, "Donation data not found.");
    }

    req.event = updatedDonation;
    next();

    return handleResponse(res, 200, "Data updated successfully.", updatedDonation);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error updating donation details", error.message);
  }
};

exports.deleteDonationData = async (req, res) => {
  try {
    const data = await Donation.findByIdAndDelete(req.params.id);
    if (!data) {
      return handleResponse(res, 404, "Data not found");
    }
    return handleResponse(res, 200, "Donation details deleted successfully", {});
  } catch (error) {
    return handleResponse(res, 500, "Error deleting Donation details", error.message);
  }
};
