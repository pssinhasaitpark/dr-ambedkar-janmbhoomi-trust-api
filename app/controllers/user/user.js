const { userLoginSchema, userRegistrationSchema, forgatePasswordSchema, resetSchema } = require('../../vailidators/validaters');
const { handleResponse } = require('../../utils/helper');
const { Users, Testimonials } = require('../../models');
const cloudinary = require("../../middlewares/cloudinaryConfig");
const { jwtAuthentication } = require("../../middlewares")
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { sendResetEmail } = require("../../utils/emailHandler");
const path = require('path');



exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { user_name, full_name, email, mobile, password, designations, user_role } = req.body;

    try {
        const existingUser = await Users.findOne({ $or: [{ user_name }, { email }] });

        if (existingUser) {
            let errorMessage = '';
            if (existingUser.user_name === user_name) {
                errorMessage += 'Username is already taken. ';
            }
            if (existingUser.email === email) {
                errorMessage += 'Email is already registered.';
            }
            return handleResponse(res, 400, errorMessage.trim());
        }

        const data = { user_name, full_name, email, mobile, password, user_role, designations };

        const imageUrl = req.convertedFiles.image[0];
        data.image = imageUrl;


        // if (req.file) {
        //     try {
        //         const imageUrl = await cloudinary.uploadImageToCloudinary(req.file.buffer);
        //         data.image = imageUrl;
        //     } catch (cloudinaryError) {
        //         console.error('Error uploading image to Cloudinary:', cloudinaryError);
        //         return handleResponse(res, 500, 'Error uploading image to Cloudinary');
        //     }
        // }

        const newUser = new Users(data);
        await newUser.save();

        handleResponse(res, 201, 'User created successfully!', newUser);
    } catch (error) {
        console.error(error);
        handleResponse(res, 500, error.message);
    }
};

exports.loginUser = async (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) return handleResponse(res, 400, error.details[0].message);

    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return handleResponse(res, 400, 'Invalid username or password.');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return handleResponse(res, 400, 'Invalid username or password.');
        }

        const accessToken = await jwtAuthentication.signAccessToken(user.id, user.user_role);
        const encryptedToken = jwtAuthentication.encryptToken(accessToken);

        req.user = {
            id: user.id,
            user_role: user.user_role,
            encryptedToken: encryptedToken
        };

        next();

    } catch (error) {
        return handleResponse(res, 500, 'An unexpected error occurred during login.', error.message);
    }
};

exports.me = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return handleResponse(res, 401, "Unauthorized user");
        }

        const user = await Users.findOne({ _id: req.user.user_id });

        if (!user) {
            return handleResponse(res, 404, "User not found");
        }

        user.password = undefined;

        handleResponse(res, 200, "User details retrieved successfully!", user);
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        return handleResponse(res, 500, "Internal server error", error.message);
    }
};

exports.updateUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }



    const { user_name, full_name, email, mobile, password, designations, user_role } = req.body;
    const userId = req.params.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    const validRoles = ['user', 'admin', 'super-admin', 'trustees'];
    if (user_role && !validRoles.includes(user_role)) {
        return handleResponse(res, 400, 'Invalid user role provided.');
    }

    try {
        const existingUser = await Users.findById(userId);

        if (!existingUser) {
            return handleResponse(res, 404, 'User not found.');
        }

        if (email && existingUser.email !== email) {
            const emailConflict = await Users.findOne({ email });
            if (emailConflict) {
                return handleResponse(res, 400, 'Email is already registered.');
            }
        }

        if (user_name && existingUser.user_name !== user_name) {
            const userNameConflict = await Users.findOne({ user_name });
            if (userNameConflict) {
                return handleResponse(res, 400, 'Username is already taken.');
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const updatedData = {
            user_name,
            full_name,
            email,
            mobile,
            password: hashPassword,
            designations,
            user_role
        };

        // const file = req.file;
        // if (!file) {
        //     return handleResponse(res, 400, 'Image is required.');
        // }
        // const imageUrl = req.convertedFiles.image[0] || existingUser.image;
        // updatedData.image = imageUrl;

        // Check if an image is provided
        const imageUrl = (req.convertedFiles && req.convertedFiles.image && req.convertedFiles.image[0]) || existingUser.image;
        updatedData.image = imageUrl;

        // if (req.file) {
        //     try {
        //         const imageUrl = await cloudinary.uploadImageToCloudinary(req.file.buffer);
        //         updatedData.image = imageUrl;
        //     } catch (cloudinaryError) {
        //         console.error('Error uploading image to Cloudinary:', cloudinaryError);
        //         return handleResponse(res, 500, 'Error uploading image to Cloudinary');
        //     }
        // }


        const updatedUser = await Users.findByIdAndUpdate(userId, updatedData, { new: true });

        handleResponse(res, 200, 'User updated successfully!', { updatedUser });
    } catch (error) {
        console.error(error);
        handleResponse(res, 500, error.message);
    }
};

exports.getTrustees = async (req, res) => {
    try {

        const data = await Users.find({ user_role: 'trustees' }).sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No trustees found in the database");
        }

        return handleResponse(res, 200, "Trustees fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching Trustees details", error.message);
    }
};

exports.getAllUsers = async (req, res) => {
    try {

        const data = await Users.find({ user_role: 'user' });

        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No User found in the database");
        }

        return handleResponse(res, 200, "User fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching User details", error.message);
    }
};

exports.deletUserbyId = async (req, res) => {
    try {

        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
        }

        const data = await Users.findByIdAndDelete(req.params.id);
        if (!data) {
            return handleResponse(res, 404, "User details not found");
        }

        return handleResponse(res, 200, "User  deleted successfully", data);
    } catch (error) {
        return handleResponse(res, 500, "Error deleting user ", error.message);
    }
};

exports.forgatePassword = async (req, res) => {
    try {
        const { error } = forgatePasswordSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }

        const { email } = req.body;

        const user = await Users.findOne({ email });

        if (!user) {
            return handleResponse(res, 404, "User is not registered");
        }

        const resetToken = await jwtAuthentication.signResetToken(email);
        const encryptedToken = jwtAuthentication.encryptToken(resetToken);

        user.isUsed = false;
        await user.save();
        await sendResetEmail(user.email, encryptedToken);

        return handleResponse(res, 200, "Password reset email sent successfully", { token: encryptedToken });
    } catch (error) {
        console.error(error);
        return handleResponse(res, 400, error.message || "An error occurred during the password reset process");
    }
};

exports.resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;


    const { email } = req.user;

    const { error } = resetSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    try {

        if (user.isUsed === true) {
            return handleResponse(res, 400, 'Reset token has expired');
        }

        if (newPassword !== confirmPassword) {
            return handleResponse(res, 400, 'Passwords do not match');
        }

        const user = await Users.findOne({ email: email });


        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }

        user.password = newPassword;
        user.isUsed = true;
        await user.save();

        return handleResponse(res, 200, 'Password has been successfully reset');
    } catch (err) {
        console.error('Error resetting password:', err);
        return handleResponse(res, 400, err.message || 'An error occurred during the password reset process');
    }
};

exports.testimonials = async (req, res) => {
    try {
        const { description } = req.body;

        // if (req.files && req.files.case_studies && req.files.case_studies.length > 0) {
        //     const caseStudyUploadPromises = req.files.case_studies.map((file) =>
        //         cloudinary.uploadImageToCloudinary(file.buffer)
        //     );
        //     caseStudiesUrls = await Promise.all(caseStudyUploadPromises);
        // }

        // if (req.files && req.files.stories && req.files.stories.length > 0) {
        //     const storiesUploadPromises = req.files.stories.map((file) =>
        //         cloudinary.uploadImageToCloudinary(file.buffer)
        //     );
        //     storiesUrls = await Promise.all(storiesUploadPromises);
        // }

        let caseStudiesUrls = [];
        let storiesUrls = [];

        if (req.convertedFiles && req.convertedFiles.case_studies) {
            caseStudiesUrls = req.convertedFiles.case_studies;
        }

        if (req.convertedFiles && req.convertedFiles.stories) {
            storiesUrls = req.convertedFiles.stories;
        }

        const newTestimonials = new Testimonials({
            description,
            isview: false,
            case_studies: caseStudiesUrls,
            stories: storiesUrls,
        });

        await newTestimonials.save();

        return handleResponse(res, 201, 'Testimonial details added successfully!', newTestimonials);

    } catch (error) {
        console.error("Error retrieving user profile:", error);
        return handleResponse(res, 500, "Internal server error", error.message);
    }
};

exports.getTestimonials = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;


        const skip = (page - 1) * limit;


        const testimonials = await Testimonials.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        const totalTestimonials = await Testimonials.countDocuments();


        const totalPages = Math.ceil(totalTestimonials / limit);

        if (testimonials.length === 0) {
            return handleResponse(res, 404, 'No testimonials found.');
        }


        return handleResponse(res, 200, 'Testimonials retrieved successfully', {
            testimonials,
            pagination: {
                totalTestimonials,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });

    } catch (error) {
        console.error("Error retrieving testimonials:", error);
        return handleResponse(res, 500, 'Internal server error', error.message);
    }
};

exports.deleteTestimonials = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return handleResponse(res, 400, 'The provided ID is not valid. Please provide a valid Id.');
        }

        const testimonial = await Testimonials.findByIdAndDelete(id);
        if (!testimonial) {
            return handleResponse(res, 404, "No Testimonials data  found to delete.");
        }

        return handleResponse(res, 200, "Testimonials data deleted successfully!", testimonial);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "An error occurred while deleting Testimonials data.");
    }
};


