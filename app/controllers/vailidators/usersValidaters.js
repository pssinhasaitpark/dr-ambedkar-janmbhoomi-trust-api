const Joi = require('joi');

const userRegistrationSchema = Joi.object({
    user_name: Joi.string().max(50).required(),
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    email: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org'] } })
        .required()
        .messages({
            'string.email': 'Please provide a valid email',  
            'string.empty': 'Email cannot be empty',  
        }),
    mobile: Joi.string()
        .pattern(/^[0-9]{10,13}$/)
        .required()
        .messages({
            'string.pattern.base': 'Mobile number must be between 10 digits and contain only numbers.'
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.empty': 'Password cannot be empty.',
        })
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required()
});

module.exports = { userRegistrationSchema, userLoginSchema };
