const jwt = require('jsonwebtoken');
// const { authentication } = require('../vailidators/validaters');
const { authentication } = require('../vailidators/validaters');
const { errorResponse, successResponse } = require('../../utils/helper');
const { Users } = require('../../models');
const{jwtAuthentication}=require("../../middlewares")


exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
      
        return errorResponse(res, error.details[0].message, 400);
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
            return errorResponse(res, errorMessage.trim(), 400); 
        }

      
        const data = { user_name, first_name, last_name, email, mobile, password, user_role: "user" };

     
        const newUser = new Users(data);
        await newUser.save();

       
        successResponse(res, 'User created successfully!', { user_name, first_name, last_name, email, mobile, user_role: "user" }, 201);
    } catch (error) {
        console.error(error);
        errorResponse(res, error.message, 500);
    }
};

exports.loginUser = async (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message, 400);

    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return errorResponse(res, 'Invalid username or password.', 400);
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return errorResponse(res, 'Invalid username or password.', 400);
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
        return errorResponse(res, 'An unexpected error occurred during login.', 500, error.message);
    }
};

exports.me = async (req, res) => {
    try {

        
        if (!req.user || !req.user.user_id) {
            return errorResponse(res, "Unauthorized user", 401);
        }
   
        const user = await Users.findOne({ _id: req.user.user_id });
     
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
    
        successResponse(res, "User details retrieved successfully!", { user }, 200);
    } catch (error) {
      
        console.error("Error retrieving user profile:", error);
        return errorResponse(res, "Internal server error", 500, error.message);
    }
};

exports.updateUser = async (req, res) => {
   
    const { user_name, first_name,last_name, email, mobile, password } = req.body;

    try {
 
        const user = await Users.findById(req.user.user_id);
        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        if (user_name) user.user_name = user_name;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (password) user.password = password;
    
        await user.save();

        successResponse(res, 'User updated successfully!', {
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.first_name,
            email: user.email,
            mobile: user.mobile,
           
        }, 200);
    } catch (error) {
        console.error(error);
        errorResponse(res, 'An error occurred while updating the user.', 500, error.message);
    }
};


