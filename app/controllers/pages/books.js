const { handleResponse } = require("../../utils/helper");
const { Book } = require("../../models");
const { validationSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");

exports.addBookDetails = async (req, res) => {
  try {
    const { title, name, description } = req.body;

    const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const data = {
      name,
      title,
      description,
      images: imageUrls,
    };

    const newBook = new Book(data);
    await newBook.save();

    return handleResponse(res, 201, "Book Added successfully!", newBook);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error creating Books", error.message);
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

    const data = await Book.findById(req.params.id);

    if (!data) {
      return handleResponse(res, 404, "Book not found with provided id");
    }
    return handleResponse(res, 200, "Book data retrieved successfully!", data);
  } catch (error) {
    return handleResponse(res, 500, "Error retrieving Book data", error.message);
  }
};

exports.updateBookDetails = async (req, res) => {

  const { error } = validationSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, error.details[0].message);
    }

  const { id } = req.params;
  const { title, name, description } = req.body;

  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploadImageToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
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

    return handleResponse(res, 200, "Book details updated successfully.", updatedBook);
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Error updating book details data", error.message);
  }
};

exports.deleteBookDetails = async (req, res) => {
  try {
    const data = await Book.findByIdAndDelete(req.params.id);
    if (!data) {
      return handleResponse(res, 404, "Book details not found");
    }

    return handleResponse(res, 200, "Book details deleted successfully", {});
  } catch (error) {
    return handleResponse(res, 500, "Error deleting Book details data", error.message);
  }
};
