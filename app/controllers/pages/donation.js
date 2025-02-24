const { handleResponse } = require("../../utils/helper");
const { Donation } = require("../../models");
const { validationSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");
const { uploadStream } = require("../../middlewares/gridfs");


const uploadDescriptionToGridFS = async (descriptionHtml) => {
  const buffer = Buffer.from(descriptionHtml, 'utf-8'); // Convert HTML string to Buffer
  const fileId = await uploadStream('description.html', buffer); // Save HTML as file to GridFS
  return fileId; // Return the fileId
};

exports.addDonationData = async (req, res) => {
  try {
    const { title, name, description } = req.body;
    const { id } = req.query.id ? req.query : req.body;

    let existingDonation = null;
    if (id) {
      existingDonation = await Donation.findById(id);
    }

    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages);
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
      }
    }

    let imageIds = existingDonation ? [...existingDonation.images] : [];

    if (Array.isArray(removeImages)) {
      imageIds = imageIds.filter((img) => !removeImages.includes(img));
    }

    // If description is large, store it in GridFS
    let descriptionFileId = null;
    if (description) {
      descriptionFileId = await uploadDescriptionToGridFS(description);
    }

    // Process the files and upload them to GridFS (only fileId should be stored)
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const fileId = await uploadStream(file.originalname, file.buffer); // Upload file to GridFS
        return fileId; // Store only the file ID
      });

      // Collect all the fileIds for images
      const newImageIds = await Promise.all(uploadPromises);
      imageIds.push(...newImageIds);
    }

    const data = { name, title, descriptionFileId, images: imageIds };

    let newDonation;
    if (existingDonation) {
      existingDonation.set(data);
      newDonation = await existingDonation.save();
      return handleResponse(res, 200, "Donation details updated successfully!", newDonation);
    } else {
      newDonation = new Donation(data);
      await newDonation.save();
      return handleResponse(res, 201, "Donation details added successfully!", newDonation);
    }
  } catch (error) {
    console.error('Error in adding donation data:', error);
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

exports.getDonationDescription = async (req, res) => {
  try {
    const { id } = req.query;
    const donation = await Donation.findById(id).populate("descriptionFileId");

    if (!donation || !donation.descriptionFileId) {
      return handleResponse(res, 404, "Donation or description not found");
    }

    const description = await getFileFromGridFS(donation.descriptionFileId);
    return handleResponse(res, 200, "Description retrieved successfully!", description);
  } catch (error) {
    console.error("Error retrieving description", error);
    return handleResponse(res, 500, "Error retrieving description", error.message);
  }
};

exports.getDescriptionFromGridFS = async (fileId) => {
  const fileStream = getFileStream(fileId);
  let descriptionHtml = '';
  fileStream.on('data', (chunk) => {
    descriptionHtml += chunk.toString();
  });
  return new Promise((resolve, reject) => {
    fileStream.on('end', () => resolve(descriptionHtml));
    fileStream.on('error', (err) => reject(err));
  });
};