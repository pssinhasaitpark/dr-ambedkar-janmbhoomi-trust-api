const { SocialMedia } = require("../../models");
const { handleResponse } = require('../../utils/helper');
const mongoose = require('mongoose');


exports.createSocialMedia = async (req, res) => {
    try {
        const { whatsapp, facebook, instagram, youtube, linkedIn, snapchat, thread, pinterest, x } = req.body;

        const existingSocialMedia = await SocialMedia.findOne();
        
        if (existingSocialMedia) {
            return handleResponse(res, 400, "Social media links already exist. Use update instead.");
        }

        const socialMedia = new SocialMedia({
            whatsapp: { link: whatsapp },
            facebook: { link: facebook },
            instagram: { link: instagram },
            youtube: { link: youtube },
            linkedIn: { link: linkedIn },
            snapchat: { link: snapchat },
            thread: { link: thread },
            pinterest: { link: pinterest },
            x: { link: x },
        });

        await socialMedia.save();
        return handleResponse(res, 201, "Social media links created successfully!", socialMedia);

    } catch (error) {
        console.error("❌ Error:", error);
        return handleResponse(res, 500, "An error occurred while creating social media links.");
    }
};

exports.updateSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { whatsapp, facebook, instagram, youtube, linkedIn, snapchat, thread, pinterest, x } = req.body;

        const socialMedia = await SocialMedia.findById(id);
        if (!socialMedia) {
            return handleResponse(res, 404, "Social media record not found.");
        }

        socialMedia.set({
            whatsapp: whatsapp ? { link: whatsapp } : socialMedia.whatsapp,
            facebook: facebook ? { link: facebook } : socialMedia.facebook,
            instagram: instagram ? { link: instagram } : socialMedia.instagram,
            youtube: youtube ? { link: youtube } : socialMedia.youtube,
            linkedIn: linkedIn ? { link: linkedIn } : socialMedia.linkedIn,
            snapchat: snapchat ? { link: snapchat } : socialMedia.snapchat,
            thread: thread ? { link: thread } : socialMedia.thread,
            pinterest: pinterest ? { link: pinterest } : socialMedia.pinterest,
            x: x ? { link: x } : socialMedia.x,
        });

        await socialMedia.save();
        return handleResponse(res, 200, "Social media links updated successfully!", socialMedia);

    } catch (error) {
        console.error("❌ Error:", error);
        return handleResponse(res, 500, "An error occurred while updating social media links.");
    }
};

exports.getSocialMedia = async (req, res) => {
    try {
        const socialMedia = await SocialMedia.findOne();
        if (!socialMedia) {
            return handleResponse(res, 404, "No social media links found.");
        }
        return handleResponse(res, 200, "Social media links retrieved successfully!", socialMedia);
    } catch (error) {
        console.error("❌ Error:", error);
        return handleResponse(res, 500, "An error occurred while fetching social media links.");
    }
};

exports.deleteSocialMedia = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, 'The provided ID is not valid. Please provide a valid Id.');
        }

        const socialMedia = await SocialMedia.findByIdAndDelete(id);
        if (!socialMedia) {
            return handleResponse(res, 404, "No social media links found to delete.");
        }

        return handleResponse(res, 200, "Social media links deleted successfully!",socialMedia);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "An error occurred while deleting social media links.");
    }
};

