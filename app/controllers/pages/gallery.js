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
        const birthplace_media = req.files['birthplace_media'] || [];
        const events_media = req.files['events_media'] || [];
        const exhibitions_media = req.files['exhibitions_media'] || [];
        const online_media = req.files['online_media'] || [];

        const uploadImages = async (files) => {
            const uploadPromises = files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
            return await Promise.all(uploadPromises);
        };
        const birthplaceImages = await uploadImages(birthplace_media);
        const eventImages = await uploadImages(events_media);
        const exhibitionImages = await uploadImages(exhibitions_media);
        const onlineImages = await uploadImages(online_media);


        const data = {
            gallery_info,
            gallery_description,
            birthplace_media: birthplaceImages,
            events_media: eventImages,
            exhibitions_media: exhibitionImages,
            online_media: onlineImages,
        };

      
        const newData = new Gallery(data);
        await newData.save();
        

        
        req.event = newData;
        next();

       
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

        const birthplace_media = req.files['birthplace_media'] || [];
        const events_media = req.files['events_media'] || [];
        const exhibitions_media = req.files['exhibitions_media'] || [];
        const online_media = req.files['online_media'] || [];

        const uploadImages = async (files) => {
            const uploadPromises = files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
            return await Promise.all(uploadPromises);
        };

        const birthplaceImages = await uploadImages(birthplace_media);
        const eventImages = await uploadImages(events_media);
        const exhibitionImages = await uploadImages(exhibitions_media);
        const onlineImages = await uploadImages(online_media);

        const data = {
            gallery_info: gallery_info || existingGallery.gallery_info,  // Keep existing if not provided
            gallery_description: gallery_description || existingGallery.gallery_description,  // Keep existing if not provided
            birthplace_media: birthplaceImages.length ? birthplaceImages : existingGallery.birthplace_media,  // Replace if new images are uploaded
            events_media: eventImages.length ? eventImages : existingGallery.events_media,  // Replace if new images are uploaded
            exhibitions_media: exhibitionImages.length ? exhibitionImages : existingGallery.exhibitions_media,  // Replace if new images are uploaded
            online_media: onlineImages.length ? onlineImages : existingGallery.online_media,  // Replace if new images are uploaded
        };

        // Update the gallery with new data
        const updatedGallery = await Gallery.findByIdAndUpdate(id, data, { new: true });

        // If no gallery was updated, return an error
        if (!updatedGallery) {
            return handleResponse(res, 404, 'Gallery data not found.');
        }

        // Pass the updated gallery object to the next middleware
        req.event = updatedGallery;
        next();

        // Send a success response
        return handleResponse(res, 200, 'Gallery data updated successfully.', updatedGallery);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'Error updating gallery data', error.message);
    }
};

// exports.updateGalleryData = async (req, res, next) => {
//     // const { error } = gallerySchema.validate(req.body);
//     // if (error) {
//     //     return handleResponse(res, 400, error.details[0].message);
//     // }

//     const { id } = req.params;
//     const { gallery_info, gallery_description, removed_birthplace_images, removed_events_images, removed_exhibitions_images, removed_online_images } = req.body;

//     try {
//         const existingGallery = await Gallery.findById(id);
//         if (!existingGallery) {
//             return handleResponse(res, 404, 'Gallery data not found.');
//         }

//         const birthplace_media = req.files['birthplace_media'] || [];
//         const events_media = req.files['events_media'] || [];
//         const exhibitions_media = req.files['exhibitions_media'] || [];
//         const online_media = req.files['online_media'] || [];

//         // Upload function for images
//         const uploadImages = async (files) => {
//             const uploadPromises = files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
//             return await Promise.all(uploadPromises);
//         };

//         const birthplaceImages = await uploadImages(birthplace_media);
//         const eventImages = await uploadImages(events_media);
//         const exhibitionImages = await uploadImages(exhibitions_media);
//         const onlineImages = await uploadImages(online_media);

//         // Function to remove images by IDs
//         const removeImagesByIds = (existingImages, removedImageIds) => {
//             return existingImages.filter(image => !removedImageIds.includes(image._id.toString()));
//         };

//         // Handle the removal of images
//         const updatedBirthplaceImages = removeImagesByIds(existingGallery.birthplace_media, removed_birthplace_images || []);
//         const updatedEventImages = removeImagesByIds(existingGallery.events_media, removed_events_images || []);
//         const updatedExhibitionImages = removeImagesByIds(existingGallery.exhibitions_media, removed_exhibitions_images || []);
//         const updatedOnlineImages = removeImagesByIds(existingGallery.online_media, removed_online_images || []);

//         // Add new uploaded images to existing ones
//         const finalBirthplaceImages = [...updatedBirthplaceImages, ...birthplaceImages];
//         const finalEventImages = [...updatedEventImages, ...eventImages];
//         const finalExhibitionImages = [...updatedExhibitionImages, ...exhibitionImages];
//         const finalOnlineImages = [...updatedOnlineImages, ...onlineImages];

//         // Prepare the data for update
//         const data = {
//             gallery_info: gallery_info || existingGallery.gallery_info,  // Keep existing if not provided
//             gallery_description: gallery_description || existingGallery.gallery_description,  // Keep existing if not provided
//             birthplace_media: finalBirthplaceImages,  // Updated list of images
//             events_media: finalEventImages,  // Updated list of images
//             exhibitions_media: finalExhibitionImages,  // Updated list of images
//             online_media: finalOnlineImages,  // Updated list of images
//         };

//         // Update the gallery with new data
//         const updatedGallery = await Gallery.findByIdAndUpdate(id, data, { new: true });

//         // If no gallery was updated, return an error
//         if (!updatedGallery) {
//             return handleResponse(res, 404, 'Gallery data not found.');
//         }

//         // Pass the updated gallery object to the next middleware
//         req.event = updatedGallery;
//         next();

//         // Send a success response
//         return handleResponse(res, 200, 'Gallery data updated successfully.', updatedGallery);
//     } catch (error) {
//         console.error(error);
//         return handleResponse(res, 500, 'Error updating gallery data', error.message);
//     }
// };



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


// exports.addGallery = async (req, res, next) => {
//     try {
//         const { error } = gallerySchema.validate(req.body);
//         if (error) {
//             return handleResponse(res, 400, error.details[0].message);
//         }

//         const { gallery_info,gallery_description} = req.body;

//         let imageUrls = [];
//         if (req.files && req.files.length > 0) {
//             const uploadPromises = req.files.map((file) =>
//                 cloudinary.uploadImageToCloudinary(file.buffer)
//             );
//             imageUrls = await Promise.all(uploadPromises);
//         }

//         const data = {
//             name,
//             title,
//             short_description,
//             long_description,
//             images: imageUrls,
//         };

//         const newData = new Gallery(data);
//         await newData.save();

//         req.event = newData;
//         next();

//         return handleResponse(res, 201, "Gallery details added successfully!", newData);
//     } catch (error) {
//         console.error(error);
//         return handleResponse(res, 500, "Error in adding gallery details", error.message);
//     }
// };













