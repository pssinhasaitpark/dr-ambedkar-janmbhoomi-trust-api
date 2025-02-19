const { handleResponse } = require("../../utils/helper");
const { News } = require("../../models");
const { newsSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");


exports.addNewsData = async (req, res) => {
    try {

        const { error } = newsSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
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
            images: imageUrls,
        };

        const newNews = new News(data);
        await newNews.save();

        return handleResponse(
            res,
            201,
            "News details added successfully!",
            newNews
        );
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding news details", error.message);
    }

};

exports.getNewsData = async (req, res) => {
    try {
        const data = await News.find().sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No news data available in the database");
        }

        return handleResponse(res, 200, "All News and update details fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching News and update details", error.message);
    }
};

exports.getNewsDataById = async (req, res) => {
    try {
        if (!req.params.id) {
            return handleResponse(res, 400, "Please provide an ID");
        }

        const data = await News.findById(req.params.id);

        if (!data) {
            return handleResponse(res, 404, "Data not found with the provided ID");
        }

        return handleResponse(res, 200, "Data retrieved successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error retrieving data", error.message);
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
                images: imageUrls,
            },
            { new: true }
        );

        if (!updatedNews) {
            return handleResponse(res, 404, 'News data not found.');
        }

        return handleResponse(res, 200, 'Data updated successfully.', updatedNews);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Error updating news details', error.message);
    }
};

exports.deleteNewsData = async (req, res) => {
    try {
        const data = await News.findByIdAndDelete(req.params.id);
        if (!data) {
            return handleResponse(res, 404, "Data not found");
        }
        return handleResponse(res, 200, "News details deleted successfully", { data });
    } catch (error) {
        return handleResponse(res, 500, "Error deleting News details", error.message);
    }
};
