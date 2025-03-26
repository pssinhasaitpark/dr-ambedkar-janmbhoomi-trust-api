const { handleResponse } = require("../../utils/helper");
const { Events } = require("../../models");
const { validationSchema } = require("../../vailidators/validaters");
const mongoose=require('mongoose')


exports.addEvents = async (req, res, next) => {
  try {

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { title, name, description } = req.body;
    const { id } = req.query.id ? req.query : req.body;

    let existingEvent = null;
    if (id) {
      existingEvent = await Events.findById(id);
    }


    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages);
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
      }
    }

    let imageUrls = existingEvent ? [...existingEvent.images] : [];


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
      name,
      title,
      description,
      images: imageUrls,
    };

    let newEvent;
    if (existingEvent) {

      existingEvent.set(data);
      newEvent = await existingEvent.save();
      req.event = newEvent;
      next();

      return handleResponse(res, 200, "Event updated successfully!", newEvent);
    } else {

      newEvent = new Events(data);
      await newEvent.save();
      req.event = newEvent;
      next();

      return handleResponse(res, 201, "Event added successfully!", newEvent);
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error in creating or updating an event", error.message);
  }
};

exports.getEventsData = async (req, res) => {
  try {
    const data = await Events.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return handleResponse(res, 404, "No data available in the database");
    }

    return handleResponse(res, 200, "All Event Details fetched successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error fetching events details", error.message);
  }
};

exports.getEventsDataById = async (req, res) => {
  try {

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    if (!id) {
      return handleResponse(res, 404, "Please provide ID");
    }

    const data = await Events.findById(id);

    if (!data) {
      return handleResponse(res, 404, "Event data not found with provided ID");
    }

    return handleResponse(res, 200, "Event data retrieved successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error retrieving events data", error.message);
  }
};

exports.updateEvent = async (req, res, next) => {
  const { error } = validationSchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
  }
  const { title, name, description } = req.body;

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

    const updatedEvent = await Events.findByIdAndUpdate(
      id,
      {
        title,
        name,
        description,
        images: imageUrls,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return handleResponse(res, 404, "Event not found.");
    }


    req.event = updatedEvent;

    return handleResponse(res, 200, "Event updated successfully.", updatedEvent);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error updating events details", error.message);
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    const data = await Events.findByIdAndDelete(id);
    if (!data) {
      return handleResponse(res, 404, "Event not found");
    }
    return handleResponse(res, 200, "Event deleted successfully", data);
  } catch (error) {
    return handleResponse(res, 500, "Error deleting event details", error.message);
  }
};
