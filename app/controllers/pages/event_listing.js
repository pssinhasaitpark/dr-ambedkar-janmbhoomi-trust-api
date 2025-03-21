const { handleResponse } = require("../../utils/helper");
const { Eventlisting } = require("../../models");
const { eventListingSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");


exports.addWEventDetails = async (req, res, next) => {
    try {
        const { error } = eventListingSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }
        const { event_title, organized_by, description } = req.body;

        let imageUrls = [];
        // if (req.files && req.files.length > 0) {
        //   const uploadPromises = req.files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
        //   imageUrls = await Promise.all(uploadPromises);
        // }

    if (req.convertedFiles && req.convertedFiles.images) {
        imageUrls = [...imageUrls, ...req.convertedFiles.images];
    }

        const data = {
            event_title,
            organized_by,
            description,
            images: imageUrls
        }

        const newEventDetails = new Eventlisting(data);
        await newEventDetails.save();


        return handleResponse(res, 201, "Event details added successfully!", newEventDetails);
    }
    catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding event details", error.message);
    }
}

exports.getEventsData = async (req, res) => {
    try {
        const data = await Eventlisting.find().sort({ createdAt: -1 });
        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No data available in the database");
        }
        return handleResponse(res, 200, "Event details fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching Event details", error.message);
    }
};

exports.getEventsDataById = async (req, res) => {
    try {
        if (!req.params.id) {
            return handleResponse(res, 400, "Please provide an ID");
        }

        const data = await Eventlisting.findById(req.params.id);

        if (!data) {
            return handleResponse(res, 404, "Event not found with provided id");
        }
        return handleResponse(res, 200, "Event details retrieved successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error retrieving Event details", error.message);
    }
};

exports.updateEventDetails = async (req, res, next) => {

    const { error } = eventListingSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }
    const { id } = req.params;
    try {
        const { event_title, organized_by, description } = req.body;


        let existingEvent = null;
        if (id) {
            existingEvent = await Eventlisting.findById(id);
            if (!existingEvent) {
                return handleResponse(res, 404, "Event Details not found with provided id");
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

        const updatedEvent = await Eventlisting.findByIdAndUpdate(
            id,
            {
                event_title,
                organized_by,
                description,
                images: imageUrls,
            },
            { new: true }
        );

        if (!updatedEvent) {
            return handleResponse(res, 404, "Event not found.");
        }
        req.event = updatedEvent;
        next();

        return handleResponse(res, 200, "Event details updated successfully.", updatedEvent);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error updating Event details data", error.message);
    }
};

exports.deleteEventDetails = async (req, res) => {
    try {
        const data = await Eventlisting.findByIdAndDelete(req.params.id);
        if (!data) {
            return handleResponse(res, 404, "Event details not found");
        }

        return handleResponse(res, 200, "Event details deleted successfully", data);
    } catch (error) {
        return handleResponse(res, 500, "Error deleting Event details ", error.message);
    }
};
