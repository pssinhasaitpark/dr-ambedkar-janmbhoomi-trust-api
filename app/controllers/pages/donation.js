const { successResponse, errorResponse } = require("../../utils/helper");
const { Donation } = require("../../models");
const { donationSchema } = require("../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.addDonationData=async(req,res) =>{
  try{

    const { error } = donationSchema.validate(req.body);
    if (error) {
      
        return errorResponse(res, error.details[0].message, 400);
    }
  const {title,name,description}=req.body;

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
    image_urls: imageUrls,
  };

  const newDonation = new Donation(data);
  await newDonation.save();

  successResponse(
    res,
    "Donation details  added successfully!",
    newDonation,
    201
  );
} catch (error) {
  console.error(error);
  errorResponse(res, "Error in adding donation details", 500, error.message);
}

};

exports.getDonationData = async (req, res) => {
  try {
    const data = await Donation.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return errorResponse(res, "No data available in the database", 404);
    }
    successResponse(res, " All Donation and Support details fetched successfully!",data, 200);
  } catch (error) {
    errorResponse(res, "Error fetching donation and support detials", 500, error.message);
  }
};

exports.getDonationDataById = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Please provide an ID", 400);
  }

    const data = await Donation.findById(req.params.id);

    if (!data) {
      return errorResponse(res, "data not found with provided id", 404);
    }
    successResponse(
      res,
      "Data retrieved successfully!",
       data ,
      200
    );
  } catch (error) {
    errorResponse(res, "Error retrieving  data", 500, error.message);
  }
};

exports.updateDonationData = async (req, res) => {
   const { id } = req.params;
   const {title,name,description}=req.body;

   try {
     let imageUrls = [];
 
 
     if (req.files && req.files.length > 0) {
       const uploadPromises = req.files.map((file) =>
         cloudinary.uploadImageToCloudinary(file.buffer)
       );
       imageUrls = await Promise.all(uploadPromises);
     }
    
     
     const updatedEvents = await Donation.findByIdAndUpdate(
       id, 
       {
         title,
         name,
         description,
         image_urls: imageUrls, 
       },
       { new: true } 
     );
 
     if (!updatedEvents) {
       return errorResponse(res, 'Donation data not found.', 404);
     }
 
     return successResponse(res, 'Data  updated successfully.', updatedEvents, 200);
   } catch (error) {
     console.error(error);
     return errorResponse(res, 'Error updating donation details', 500, error.message);
   }
};

exports.deleteDonationData = async (req, res) => {
  try {
    const data = await Donation.findByIdAndDelete(req.params.id);
    if (!data) {
      return errorResponse(res, "Data not found", 404);
    }
    successResponse(res, "Donation details  deleted successfully", {data}, 200);
  } catch (error) {
    errorResponse(res, "Error deleting Donation details", 500, error.message);
  }
};

