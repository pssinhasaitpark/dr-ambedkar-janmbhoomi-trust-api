const { successResponse, errorResponse } = require("../../utils/helper");
const {  Book } = require("../../models");
const { bookSchema } = require("../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");



exports.addBookDetails=async(req,res) =>{
  try{
  const {title,name,description}=req.body;

  const { error } = bookSchema.validate(req.body);
        if (error) {
            return errorResponse(res, error.details[0].message, 400);
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
    image_urls: imageUrls,
  };

  const newBook = new Book(data);
  await newBook.save();

  successResponse(
    res,
    "Book Added successfully!",
    newBook,
    201
  );
} catch (error) {
  console.error(error);
  errorResponse(res, "Error creating Books", 500, error.message);
}

};

exports.getBooksData = async (req, res) => {
  try {
    const data = await Book.find().sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return errorResponse(res, "No data available in the database", 404);
    }
    successResponse(res, "Books data fetched successfully!",data, 200);
  } catch (error) {
    errorResponse(res, "Error fetching Books data", 500, error.message);
  }
};

exports.getBooksById = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Please provide an ID", 400);
  }

    const data = await Book.findById(req.params.id);

    if (!data) {
      return errorResponse(res, "Book not found with provided id", 404);
    }
    successResponse(
      res,
      "Book data retrieved successfully!",
       data ,
      200
    );
  } catch (error) {
    errorResponse(res, "Error retrieving Book data", 500, error.message);
  }
};

exports.updateBookDetails = async (req, res) => {
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
        image_urls: imageUrls, 
      },
      { new: true } 
    );

    if (!updatedBook) {
      return errorResponse(res, 'Book not found.', 404);
    }

    return successResponse(res, 'Book details updated successfully.', updatedBook, 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Error updating book details data', 500, error.message);
  }
};

exports.deleteBookDetails = async (req, res) => {
  try {
    const data = await Book.findByIdAndDelete(req.params.id);
    if (!data) {
      return errorResponse(res, "Book details not found", 404);
    }
    successResponse(res, "Book details deleted successfully", {FormDataEvent}, 200);
  } catch (error) {
    errorResponse(res, "Error deleting Book details data", 500, error.message);
  }
};
