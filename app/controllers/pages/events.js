const { successResponse, errorResponse } = require("../../utils/helper");
const { Events } = require("../../models");
const { eventsSchema } = require("../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.addEvents=async(req,res) =>{
  try{

    const { error } = eventsSchema.validate(req.body);
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

  const newEvent = new Events(data);
  await newEvent.save();

  successResponse(
    res,
    "Event added successfully!",
    newEvent,
    201
  );
} catch (error) {
  console.error(error);
  errorResponse(res, "Error in creating a event", 500, error.message);
}

};

exports.getEventsData = async (req, res) => {
  try {
    const data = await Events.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return errorResponse(res, "No data available in the database", 404);
    }
    
    successResponse(res, " All Event Details fetched successfully!",data, 200);
  } catch (error) {
    errorResponse(res, "Error fetching events detials", 500, error.message);
  }
};

exports.getEventsDataById = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "please provide id", 404);
    }
    const data = await Events.findById(req.params.id);

    if (!data) {
      return errorResponse(res, "Events data not found with provided id", 404);
    }
    successResponse(
      res,
      "Event data retrieved successfully!",
       data ,
      200
    );
  } catch (error) {
    errorResponse(res, "Error retrieving Events data", 500, error.message);
  }
};

exports.updateEvent = async (req, res) => {
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
    
     
     const updatedEvents = await Events.findByIdAndUpdate(
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
       return errorResponse(res, 'Events not found.', 404);
     }
 
     return successResponse(res, 'Events  updated successfully.', updatedEvents, 200);
   } catch (error) {
     console.error(error);
     return errorResponse(res, 'Error updating Events details', 500, error.message);
   }
};

exports.deleteEvent = async (req, res) => {
  try {
    const data = await Events.findByIdAndDelete(req.params.id);
    if (!data) {
      return errorResponse(res, "Events not found", 404);
    }
    successResponse(res, "Event  deleted successfully", {}, 200);
  } catch (error) {
    errorResponse(res, "Error deleting Event details", 500, error.message);
  }
};

