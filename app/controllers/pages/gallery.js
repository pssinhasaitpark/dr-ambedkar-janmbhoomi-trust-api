const { handleResponse } = require("../../utils/helper");
const { Gallery } = require("../../models");
const { gallerySchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");
const mongoose = require('mongoose');

exports.addGallery = async (req, res) => {
    try {
        const { error } = gallerySchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }

        const { title, name, short_description, long_description } = req.body;

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
            short_description,
            long_description,
            images: imageUrls,
        };

        const newData = new Gallery(data);
        await newData.save();

        return handleResponse(res, 201, "Gallery details added successfully!", newData);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding gallery details", error.message);
    }
};

exports.getGalleryData = async (req, res) => {
    try {
        const data = await Gallery.find().sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No gallery data available in the database");
        }

        return handleResponse(res, 200, "All Gallery details fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching gallery details", error.message);
    }
};

exports.getGalleryDataById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
        }

        const data = await Gallery.findById(id);

        if (!data) {
            return handleResponse(res, 404, `No data found for ID: ${id}`);
        }

        return handleResponse(res, 200, 'Data retrieved successfully.', data);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to retrieve data.', error.message);
    }
};

exports.updateGalleryData = async (req, res) => {

    const { error } = gallerySchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { id } = req.params;
    const { title, name, short_description, long_description } = req.body;

    try {
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)
            );
            imageUrls = await Promise.all(uploadPromises);
        }

        const updatedGallery = await Gallery.findByIdAndUpdate(
            id,
            {
                title,
                name,
                short_description,
                long_description,
                images: imageUrls,
            },
            { new: true }
        );

        if (!updatedGallery) {
            return handleResponse(res, 404, 'Gallery data not found.');
        }

        return handleResponse(res, 200, 'Gallery data updated successfully.', updatedGallery);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Error updating gallery data', error.message);
    }
};

exports.deleteGalleryData = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
        }

        const data = await Gallery.findByIdAndDelete(id);

        if (!data) {
            return handleResponse(res, 404, 'Gallery details not found.');
        }

        return handleResponse(res, 200, 'Gallery details deleted successfully.', data);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to delete gallery details.', error.message);
    }
};
