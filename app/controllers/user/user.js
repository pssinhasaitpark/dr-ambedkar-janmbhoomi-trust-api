const jwt = require('jsonwebtoken');
const { userLoginSchema ,userRegistrationSchema} = require('../../vailidators/validaters');
const { handleResponse } = require('../../utils/helper');
const { Users,Testimonials } = require('../../models');
const cloudinary = require("../../middlewares/cloudinaryConfig");
const{jwtAuthentication}=require("../../middlewares")


exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }

    const { user_name, first_name, last_name, email, mobile, password } = req.body;
    
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

        const data = { user_name, first_name, last_name, email, mobile, password, user_role: "user" };

        const newUser = new Users(data);
        await newUser.save();

        handleResponse(res, 201, 'User created successfully!', {newUser});
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
    const { user_name, first_name, last_name, email, mobile, password } = req.body;

    try {
        const user = await Users.findById(req.user.user_id);
        if (!user) {
            return handleResponse(res, 404, 'User not found.');
        }

        if (user_name) user.user_name = user_name;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (password) user.password = password;

        await user.save();

        handleResponse(res, 200, 'User updated successfully!', {
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            mobile: user.mobile,
        });
    } catch (error) {
        console.error(error);
        handleResponse(res, 500, 'An error occurred while updating the user.', error.message);
    }
};

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
            isview:false,
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
