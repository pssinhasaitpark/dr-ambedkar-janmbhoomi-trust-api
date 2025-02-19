const { handleResponse } = require('../../utils/helper');
const { bannerSchema } = require('../../vailidators/validaters');
const { Banner } = require('../../models');
const cloudinary = require("../../middlewares/cloudinaryConfig");

exports.createBanner = async (req, res) => {
    try {
        const { error } = bannerSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
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

        return handleResponse(res, 201, 'Banner details added successfully!', newBanner);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to add banner details.');
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        if (!banners || banners.length === 0) {
            return handleResponse(res, 404, 'No data available in the database');
        }

        return handleResponse(res, 200, 'Banners retrieved successfully.', banners);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to retrieve banners.');
    }
};

exports.getBannerById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return handleResponse(res, 400, "Please provide an ID");
        }

        const banner = await Banner.findById(id);

        if (!banner) {
            return handleResponse(res, 404, `No banner found for ID: ${id}`);
        }

        return handleResponse(res, 200, 'Banner retrieved successfully.', banner);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to retrieve banner.');
    }
};

exports.updateBanner = async (req, res) => {
    const { id } = req.params;
    const { name, heading, beginning_date, completion_date, opening_date, location } = req.body;

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
            opening_date,
            location,
            image_urls: imageUrls
        }, { new: true });

        if (!updatedBanner) {
            return handleResponse(res, 404, 'Banner not found.');
        }

        return handleResponse(res, 200, 'Banner updated successfully.', updatedBanner);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to update banner.');
    }
};

exports.deleteBanner = async (req, res) => {
    const { id } = req.params;

    try {
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return handleResponse(res, 404, 'Banner not found.');
        }

        return handleResponse(res, 200, 'Banner deleted successfully.', banner);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Failed to delete banner.');
    }
};
