const { handleResponse } = require("../../utils/helper");
const { Gallery } = require("../../models");
const { gallerySchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");
const mongoose = require('mongoose');



exports.addGallery = async (req, res, next) => {
    try {
        const { error } = gallerySchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }

        const { gallery_info, gallery_description } = req.body;
        const { id } = req.query.id ? req.query : req.body;
        let existingGallery = null;
        if (id) {
            existingGallery = await Gallery.findById(id);
        }



        // const birthplace_media = req.files['birthplace_media'] || [];
        // const events_media = req.files['events_media'] || [];
        // const exhibitions_media = req.files['exhibitions_media'] || [];
        // const online_media = req.files['online_media'] || [];

        let birthplace_media = req.convertedFiles['birthplace_media'] || [];
        let events_media = req.convertedFiles['events_media'] || [];
        let exhibitions_media = req.convertedFiles['exhibitions_media'] || [];
        let online_media = req.convertedFiles['online_media'] || [];


        let removeImages = [];

        if (req.body.removeImages) {
            try {
                removeImages = JSON.parse(req.body.removeImages);
                if (!Array.isArray(removeImages)) {
                    return handleResponse(res, 400, "removeImages must be an array of URLs.");
                }
            } catch (error) {
                return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
            }
        }

        // const uploadImages = async (files) => {
        //     const uploadPromises = files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
        //     return await Promise.all(uploadPromises);
        // };

        // let birthplaceImages = await uploadImages(birthplace_media);
        // let eventImages = await uploadImages(events_media);
        // let exhibitionImages = await uploadImages(exhibitions_media);
        // let onlineImages = await uploadImages(online_media);

        const mergeImages = (existingImages, newImages, removeImagesList) => {
            if (!Array.isArray(removeImagesList)) {
                removeImagesList = [];
            }

            let updatedImages = existingImages.filter(img => !removeImagesList.includes(img));

            updatedImages.unshift(...newImages);

            return updatedImages;
        };


        if (existingGallery) {
            birthplace_media = mergeImages(existingGallery.birthplace_media, birthplace_media, removeImages);
            events_media = mergeImages(existingGallery.events_media, events_media, removeImages);
            exhibitions_media = mergeImages(existingGallery.exhibitions_media, exhibitions_media, removeImages);
            online_media = mergeImages(existingGallery.online_media, online_media, removeImages);
        }


        const data = {
            gallery_info,
            gallery_description,
            birthplace_media: birthplace_media,
            events_media: events_media,
            exhibitions_media: exhibitions_media,
            online_media: online_media,
        };


        let newGallery;
        if (existingGallery) {
            existingGallery.set(data);
            newGallery = await existingGallery.save();
            req.event = newGallery;
            next();
            return handleResponse(res, 200, "Gallery details updated successfully!", newGallery);
        } else {
            newGallery = new Gallery(data);
            await newGallery.save();
            req.event = newGallery;
            next();
            return handleResponse(res, 201, "Gallery details added successfully!", newGallery);
        }
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding or updating gallery details", error.message);
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

exports.updateGalleryData = async (req, res, next) => {
    const { error } = gallerySchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { id } = req.params;
    const { gallery_info, gallery_description } = req.body;

    try {
        const existingGallery = await Gallery.findById(id);
        if (!existingGallery) {
            return handleResponse(res, 404, 'Gallery data not found.');
        }

        // const birthplace_media = req.files['birthplace_media'] || [];
        // const events_media = req.files['events_media'] || [];
        // const exhibitions_media = req.files['exhibitions_media'] || [];
        // const online_media = req.files['online_media'] || [];


        const birthplace_media = req.convertedFiles['birthplace_media'] || [];
        const events_media = req.convertedFiles['events_media'] || [];
        const exhibitions_media = req.convertedFiles['exhibitions_media'] || [];
        const online_media = req.convertedFiles['online_media'] || [];

        // const uploadImages = async (files) => {
        //     const uploadPromises = files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
        //     return await Promise.all(uploadPromises);
        // };

        // const birthplaceImages = await uploadImages(birthplace_media);
        // const eventImages = await uploadImages(events_media);
        // const exhibitionImages = await uploadImages(exhibitions_media);
        // const onlineImages = await uploadImages(online_media);

        const data = {
            gallery_info: gallery_info || existingGallery.gallery_info,
            gallery_description: gallery_description || existingGallery.gallery_description,
            birthplace_media: birthplace_media.length ? birthplace_media : existingGallery.birthplace_media,
            events_media: events_media.length ? events_media : existingGallery.events_media,
            exhibitions_media: exhibitions_media.length ? exhibitions_media : existingGallery.exhibitions_media,
            online_media: online_media.length ? online_media : existingGallery.online_media,
        };

        const updatedGallery = await Gallery.findByIdAndUpdate(id, data, { new: true });

        if (!updatedGallery) {
            return handleResponse(res, 404, 'Gallery data not found.');
        }

        req.event = updatedGallery;
        next();

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











