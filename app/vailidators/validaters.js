const Joi = require("joi");

exports.userRegistrationSchema = Joi.object({
  user_name: Joi.string().max(50).required(),
  full_name: Joi.string().max(50).required(),
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
  designations:Joi.string().min(2).required(),
  user_role:Joi.string().required()
});

exports.forgatePasswordSchema=Joi.object({
  email:Joi.string().required()
})

exports.resetSchema=Joi.object({
  newPassword:Joi.string().required(),
  confirmPassword:Joi.string().required()
})

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
  removeImages:Joi.string().optional()
});

exports.validationSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  removeImages:Joi.string().optional()
});

exports.newsSchema = Joi.object({
  latest_news: Joi.string().required(),
  headline: Joi.string().required(),
  description: Joi.string().required(),
  removeImages:Joi.string().optional()
});


exports.donationCollectionSchema = Joi.object({
  amount: Joi.number().required(),
  full_name: Joi.string().required(),
  email: Joi.string().required(),
  phone:Joi.string().required()

});


exports.bookListingSchema = Joi.object({
  author_name: Joi.string().required(),
  book_title: Joi.string().required(),
  description: Joi.string().required(),
  removeImages:Joi.string().optional()
});


exports.eventListingSchema = Joi.object({
  event_title: Joi.string().required(),
  organized_by: Joi.string().required(),
  description: Joi.string().required(),
  removeImages:Joi.string().optional()
});

exports.contactSchema=Joi.object({
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email cannot be empty",
    }),
    phone_no: Joi.string()
    .pattern(/^[0-9]{10,13}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be between 10 digits and contain only numbers.",
    }),
    location:Joi.string().required()
})
exports.gallerySchema=Joi.object({
  gallery_info: Joi.string().required(),
  gallery_description: Joi.string().required(),
  removeImages:Joi.string().optional()
})
