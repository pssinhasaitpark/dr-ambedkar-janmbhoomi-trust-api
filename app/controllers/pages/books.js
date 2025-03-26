const { handleResponse } = require("../../utils/helper");
const { Book } = require("../../models");
const { validationSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");
const mongoose = require('mongoose')

exports.addBookDetails = async (req, res, next) => {
  try {

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    const { title, name, description } = req.body;
    const { id } = req.query.id ? req.query : req.body;

    let existingBook = null;
    if (id) {
      existingBook = await Book.findById(id);
    }


    let removeImages = [];
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages);
      } catch (error) {
        return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
      }
    }

    let imageUrls = existingBook ? [...existingBook.images] : [];


    if (Array.isArray(removeImages)) {
      imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
    }


    // if (req.files && req.files.length > 0) {
    //   const uploadPromises = req.files.map((file) =>
    //     cloudinary.uploadImageToCloudinary(file.buffer)  
    //   );
    //   const newImageUrls = await Promise.all(uploadPromises);
    //   imageUrls.push(...newImageUrls);  
    // }

    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
    }


    const data = {
      name,
      title,
      description,
      images: imageUrls,
    };

    let newBook;
    if (existingBook) {

      existingBook.set(data);
      newBook = await existingBook.save();
      req.event = newBook;
      next();

      return handleResponse(res, 200, "Book updated successfully!", newBook);
    } else {

      newBook = new Book(data);
      await newBook.save();
      req.event = newBook;
      next();

      return handleResponse(res, 201, "Book added successfully!", newBook);
    }
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error creating or updating book details", error.message);
  }
};

exports.getBooksData = async (req, res) => {
  try {
    const data = await Book.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return handleResponse(res, 404, "No data available in the database");
    }
    return handleResponse(res, 200, "Books data fetched successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error fetching Books data", error.message);
  }
};

exports.getBooksById = async (req, res) => {
  try {
    if (!req.params.id) {
      return handleResponse(res, 400, "Please provide an ID");
    }
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    const data = await Book.findById(req.params.id);

    if (!data) {
      return handleResponse(res, 404, "Book not found with provided id");
    }
    return handleResponse(res, 200, "Book data retrieved successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error retrieving Book data", error.message);
  }
};

exports.updateBookDetails = async (req, res, next) => {

  const { error } = validationSchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

  const { id } = req.params;


  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
  }

  const { title, name, description } = req.body;

  try {
    let imageUrls = [];

    // if (req.files && req.files.length > 0) {
    //   const uploadPromises = req.files.map((file) =>
    //     cloudinary.uploadImageToCloudinary(file.buffer)
    //   );
    //   imageUrls = await Promise.all(uploadPromises);
    // }

    if (req.convertedFiles && req.convertedFiles.images) {
      imageUrls = [...imageUrls, ...req.convertedFiles.images];
    }
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        name,
        description,
        images: imageUrls,
      },
      { new: true }
    );

    if (!updatedBook) {
      return handleResponse(res, 404, "Book not found.");
    }
    req.event = updatedBook;
    next();
    return handleResponse(res, 200, "Book details updated successfully.", updatedBook);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error updating book details data", error.message);
  }
};

exports.deleteBookDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return handleResponse(res, 400, "The provided ID is not valid. Please provide a valid ID.");
    }

    const data = await Book.findByIdAndDelete(id);
    if (!data) {
      return handleResponse(res, 404, "Book details not found");
    }

    return handleResponse(res, 200, "Book details deleted successfully", { data });
  } catch (error) {
    return handleResponse(res, 500, "Error deleting Book details data", error.message);
  }
};
