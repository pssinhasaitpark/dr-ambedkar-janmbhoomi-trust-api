const { successResponse, errorResponse } = require("../../utils/helper");
const { Biography } = require("../../models");
const { biographySchema } = require("../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.createBiography=async(req,res) =>{
  try{
  // const {title,name,biography,born_details,death_details,short_description,awards,achievements}=req.body;
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
    // born_details,
    // death_details,
    // short_description,
    // awards,
    // achievements,
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
    const data = await Biography.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return errorResponse(res, "No data available in the database", 404);
    }
    successResponse(res, "Biography data fetched successfully!",data, 200);
  } catch (error) {
    errorResponse(res, "Error fetching biography data", 500, error.message);
  }
};

exports.getBiographyById = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Please provide an ID", 400);
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
   const { id } = req.params;
   const {title,name,biography,born_details,death_details,short_description,awards,achievements}=req.body;

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
        //  born_details,
        //  death_details,
        //  short_description,
        //  awards,
        //  achievements,
         image_urls: imageUrls, 
       },
       { new: true } 
     );
 
     if (!updatedBiography) {
       return errorResponse(res, 'Biography not found.', 404);
     }
 
     return successResponse(res, 'Biography  updated successfully.', updatedBiography, 200);
   } catch (error) {
     console.error(error);
     return errorResponse(res, 'Error updating book details data', 500, error.message);
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

