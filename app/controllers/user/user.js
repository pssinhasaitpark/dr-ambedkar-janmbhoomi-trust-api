const jwt = require('jsonwebtoken');
const { userLoginSchema, userRegistrationSchema } = require('../../vailidators/validaters');
const { handleResponse } = require('../../utils/helper');
const { Users, Testimonials } = require('../../models');
const cloudinary = require("../../middlewares/cloudinaryConfig");
const { jwtAuthentication } = require("../../middlewares")
const mongoose = require('mongoose');


exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { user_name, first_name, last_name, email, mobile, password, designations, user_role } = req.body;

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

        const data = { user_name, first_name, last_name, email, mobile, password, user_role, designations };

        if (req.file) {
            try {
                const imageUrl = await cloudinary.uploadImageToCloudinary(req.file.buffer);
                data.profile_image = imageUrl;  
            } catch (cloudinaryError) {
                console.error('Error uploading image to Cloudinary:', cloudinaryError);
                return handleResponse(res, 500, 'Error uploading image to Cloudinary');
            }
        }

        const newUser = new Users(data);
        await newUser.save();

        handleResponse(res, 201, 'User created successfully!', { newUser });
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
    const { user_name, first_name, last_name, email, mobile, password, designations, user_role } = req.body;
    const userId = req.params.id;  

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

        const updatedData = {
            user_name,
            first_name,
            last_name,
            email,
            mobile,
            password,  
            designations,
            user_role
        };

        if (req.file) {
            try {
                const imageUrl = await cloudinary.uploadImageToCloudinary(req.file.buffer);
                updatedData.profile_image = imageUrl;  
            } catch (cloudinaryError) {
                console.error('Error uploading image to Cloudinary:', cloudinaryError);
                return handleResponse(res, 500, 'Error uploading image to Cloudinary');
            }
        }

        const updatedUser = await Users.findByIdAndUpdate(userId, updatedData, { new: true });

        handleResponse(res, 200, 'User updated successfully!', { updatedUser });
    } catch (error) {
        console.error(error);
        handleResponse(res, 500, error.message);
    }
};


exports.getTrustees = async (req, res) => {
    try {

        const data = await Users.find({ user_role: 'trustee' });

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

//testimlonials

exports.testimonials = async (req, res) => {
    try {
        const { description } = req.body;
        let imageUrls = [];


        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)
            );
            imageUrls = await Promise.all(uploadPromises);
        }

        const newTestimonials = new Testimonials({
            description,
            isview: false,
            case_studies: imageUrls
        });


        await newTestimonials.save();

        // Return a success response
        return handleResponse(res, 201, 'Testimonial details added successfully!', newTestimonials);

    } catch (error) {
        // Return error response if something goes wrong
        console.error("Error retrieving user profile:", error);
        return handleResponse(res, 500, "Internal server error", error.message);
    }
};
exports.getTestimonials = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;


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
exports.showTestimonials = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;


        const skip = (page - 1) * limit;


        const testimonials = await Testimonials.find({ isview: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalTestimonials = await Testimonials.countDocuments({ isview: true });


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
