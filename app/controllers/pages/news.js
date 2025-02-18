const { successResponse, errorResponse } = require("../../utils/helper");
const { News } = require("../../models");
const { newsSchema } = require("../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.addNewsData = async (req, res) => {
    try {

        const { error } = newsSchema.validate(req.body);
        if (error) {

            return errorResponse(res, error.details[0].message, 400);
        }
        const { title, name, description } = req.body;

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

        const newNews = new News(data);
        await newNews.save();

        successResponse(
            res,
            "News details  added successfully!",
            newNews,
            201
        );
    } catch (error) {
        console.error(error);
        errorResponse(res, "Error in adding news details", 500, error.message);
    }

};

exports.getNewsData = async (req, res) => {
    try {
        const data = await News.find().sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return errorResponse(res, "No news data available in the database", 404);
        }

        successResponse(res, "All News and update details fetched successfully!", data, 200);
    } catch (error) {
        errorResponse(res, "Error fetching News and update details", 500, error.message);
    }
};

exports.getNewsDataById = async (req, res) => {
    try {
        if (!req.params.id) {
            return errorResponse(res, "Please provide an ID", 400);
        }

        const data = await News.findById(req.params.id);

        if (!data) {
            return errorResponse(res, "Data not found with the provided ID", 404);
        }

        successResponse(res, "Data retrieved successfully!", data, 200);
    } catch (error) {
        errorResponse(res, "Error retrieving data", 500, error.message);
    }
};

exports.updateNewsData = async (req, res) => {
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


        const updatedNews = await News.findByIdAndUpdate(
            id,
            {
                title,
                name,
                description,
                image_urls: imageUrls,
            },
            { new: true }
        );

        if (!updatedNews) {
            return errorResponse(res, 'News data not found.', 404);
        }

        return successResponse(res, 'Data updated successfully.', updatedNews, 200);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Error updating news details', 500, error.message);
    }
};

exports.deleteNewsData = async (req, res) => {
    try {
        const data = await News.findByIdAndDelete(req.params.id);
        if (!data) {
            return errorResponse(res, "Data not found", 404);
        }
        successResponse(res, "News details  deleted successfully", { data }, 200);
    } catch (error) {
        errorResponse(res, "Error deleting News details", 500, error.message);
    }
};

