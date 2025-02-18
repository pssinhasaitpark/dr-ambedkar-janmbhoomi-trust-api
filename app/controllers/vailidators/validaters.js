const Joi = require("joi");

exports.userRegistrationSchema = Joi.object({
  user_name: Joi.string().max(50).required(),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email cannot be empty",
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10,13}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must be between 10 digits and contain only numbers.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.empty": "Password cannot be empty.",
  }),
});

exports.userLoginSchema = Joi.object({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).required(),
});

exports.bannerSchema = Joi.object({
  name:Joi.string().min(3).required(),
  heading: Joi.string().min(3).required(),
  beginning_date: Joi.string().max(50).required(),
  completion_date: Joi.string().max(50).required(),
  opening_date:Joi.string().max(50).required(),
  location: Joi.string().required(),
});

exports.biographySchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  biography: Joi.string().required(),
});

exports.eventsSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required()
});

exports.donationSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required()
});

exports.newsSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required()
});

exports.bookSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

//module.exports = { userRegistrationSchema, userLoginSchema, bannerSchema, biographySchema,bookSchema,eventsSchema,donationSchema,newsSchema};
