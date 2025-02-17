const { bannerSchema } = require('./vailidators/validaters');
const { errorResponse, successResponse } = require('../utils/helper');
const { Banner } = require('../models');
const cloudinary = require("../utils/cloudinaryConfig");


exports.createBanner = async (req, res) => {
    try {
     
        const { error } = bannerSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
        }
        const { name, heading, beginning_date, completion_date, opening_date, location } = req.body;

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)
            );
            imageUrls = await Promise.all(uploadPromises);
        }

        const newBanner = new Banner({
            name,
            heading,
            beginning_date,
            completion_date,
            opening_date,
            location,
            image_urls: imageUrls
        });

        await newBanner.save();

        return successResponse(res, 'Banner Details added successfully!', newBanner, 201);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Failed to add banner details.', 500);
    }
};


exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        return successResponse(res, 'Banners retrieved successfully.', banners, 200);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Failed to retrieve banners.', 500);
    }
};


exports.getBannerById = async (req, res) => {
    const { id } = req.params;

    try {
        const banner = await Banner.findById(id);
        
        if (!banner) {
            return errorResponse(res, 'Banner not found.', 404);
        }

        return successResponse(res, 'Banner retrieved successfully.', banner, 200);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Failed to retrieve banner.', 500);
    }
};


exports.updateBanner = async (req, res) => {
    const { id } = req.params;
    const { name, heading, beginning_date, completion_date, Opening_date, location } = req.body;

    try {
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)
            );
            imageUrls = await Promise.all(uploadPromises);
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, {
            name,
            heading,
            beginning_date,
            completion_date,
            Opening_date,
            location,
            image_urls:imageUrls
        }, { new: true });

        if (!updatedBanner) {
            return errorResponse(res, 'Banner not found.', 404);
        }

        return successResponse(res, 'Banner updated successfully.', updatedBanner, 200);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Failed to update banner.', 500);
    }
};

exports.deleteBanner = async (req, res) => {
    const { id } = req.params;

    try {
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return errorResponse(res, 'Banner not found.', 404);
        }

        return successResponse(res, 'Banner deleted successfully.', banner, 200);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Failed to delete banner.', 500);
    }
};
