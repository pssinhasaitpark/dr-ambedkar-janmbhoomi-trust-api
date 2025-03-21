const { handleResponse } = require('../../utils/helper');
const { Biography } = require('../../models');
const { biographySchema } = require('../../vailidators/validaters');
// const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.createBiography = async (req, res, next) => {
  try {
       const { error } = biographySchema.validate(req.body);
           if (error) {
               return handleResponse(res, 400, error.details[0].message);
           }

    const { title, name, biography } = req.body;  
    const { id } = req.query;  

    let existingBiography = null;
    if (id) {
      existingBiography = await Biography.findById(id);
      if (!existingBiography) {
        return handleResponse(res, 404, "Biography not found with provided id");
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
   
    let imageUrls = existingBiography ? [...existingBiography.images] : [];

   
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
    

    if (existingBiography) {
     
      existingBiography.set({
        title: title || existingBiography.title,
        name: name || existingBiography.name,
        biography: biography || existingBiography.biography,
        images: imageUrls,  
      });

      await existingBiography.save();
      return handleResponse(res, 200, "Biography updated successfully!", {
        biography: existingBiography.toObject(),
      });
    } else {
     
      const newBiography = new Biography({
        title,
        name,
        biography,
        images: imageUrls,
      });

      await newBiography.save();

      req.event = existingBiography;
      next();

      return handleResponse(res, 201, "Biography created successfully!", {
        biography: newBiography.toObject(),
      });
    }
  } catch (error) {
    return handleResponse(res, 500, "Error creating or updating biography", {
      error: error.message,
    });
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
    // if (req.files && req.files.length > 0) {
    //   const uploadPromises = req.files.map((file) =>
    //     cloudinary.uploadImageToCloudinary(file.buffer)
    //   );
    //   imageUrls = await Promise.all(uploadPromises);
    // }
         
    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
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
        images: imageUrls,
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

    return handleResponse(res, 200, "Biography deleted successfully", {data});
  } catch (error) {
    return handleResponse(res, 500, "Error deleting biography data", error.message);
  }
};
