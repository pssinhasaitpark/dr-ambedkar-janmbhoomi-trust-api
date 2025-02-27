const { handleResponse } = require("../../utils/helper");
const { Booklisting } = require("../../models");
const { bookListingSchema } = require("../../vailidators/validaters");
const cloudinary = require("../../middlewares/cloudinaryConfig");

exports.addBookDetails = async (req, res, next) => {
    try {
        const { error } = bookListingSchema.validate(req.body);
        if (error) {
            return handleResponse(res, 400, error.details[0].message);
        }
        const { book_title, author_name, description } = req.body;


        let coverImageUrl = null;

        if (req.files && req.files.cover_image) {
            coverImageUrl = await cloudinary.uploadImageToCloudinary(req.files.cover_image[0].buffer); 
        } else {
            return handleResponse(res, 400, "Cover image is required");
        }


        let imageUrls = [];
        if (req.files && req.files.images && req.files.images.length > 0) {
            const uploadPromises = req.files.images.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
            imageUrls = await Promise.all(uploadPromises);
        }

        const data = {
            book_title,
            author_name,
            description,
            cover_image: coverImageUrl,
            images: imageUrls,  
        };

        const newBookDetails = new Booklisting(data);
        await newBookDetails.save();

        return handleResponse(res, 201, "Book details added successfully!", newBookDetails);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error in adding book details", error.message);
    }
}


// exports.addBookDetails = async (req, res, next) => {
//     try {
//         const { error } = bookListingSchema.validate(req.body);
//         if (error) {
//             return handleResponse(res, 400, error.details[0].message);
//         }
//         const { book_title, author_name, description } = req.body;

//         const imageUrl = await cloudinary.uploadImageToCloudinary(req.file.buffer);


//         let imageUrls = [];
//         if (req.files && req.files.length > 0) {
//             const uploadPromises = req.files.map((file) => cloudinary.uploadImageToCloudinary(file.buffer));
//             imageUrls = await Promise.all(uploadPromises);
//         }

//         const data = {
//             book_title,
//             author_name,
//             description,
//             cover_image: imageUrl,
//             images: imageUrls
//         }

//         const newBookDetails = new Booklisting(data);
//         await newBookDetails.save();


//         return handleResponse(res, 201, "Book details added successfully!", newBookDetails);
//     }
//     catch (error) {
//         console.error(error);
//         return handleResponse(res, 500, "Error in adding book details", error.message);
//     }
// }

exports.getBooksData = async (req, res) => {
    try {
        const data = await Booklisting.find().sort({ createdAt: -1 });
        if (!data || data.length === 0) {
            return handleResponse(res, 404, "No data available in the database");
        }
        return handleResponse(res, 200, "Books details fetched successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error fetching Books details", error.message);
    }
};

exports.getBooksById = async (req, res) => {
    try {
        if (!req.params.id) {
            return handleResponse(res, 400, "Please provide an ID");
        }

        const data = await Booklisting.findById(req.params.id);

        if (!data) {
            return handleResponse(res, 404, "Book not found with provided id");
        }
        return handleResponse(res, 200, "Book details retrieved successfully!", data);
    } catch (error) {
        return handleResponse(res, 500, "Error retrieving Book details", error.message);
    }
};



exports.updateBookDetails = async (req, res, next) => {
    const { error } = bookListingSchema.validate(req.body);
    if (error) {
        return handleResponse(res, 400, error.details[0].message);
    }
    const { id } = req.params;
    try {
        const { book_title, author_name, description } = req.body;

        let existingBook = null;
        if (id) {
            existingBook = await Booklisting.findById(id);
            if (!existingBook) {
                return handleResponse(res, 404, "Book Details not found with provided id");
            }
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

        let coverImageUrl = existingBook.cover_image;
        if (req.files && req.files.cover_image) {
            coverImageUrl = await cloudinary.uploadImageToCloudinary(req.files.cover_image[0].buffer);
        }

        if (req.files && req.files.images && req.files.images.length > 0) {
            const uploadPromises = req.files.images.map((file) =>
                cloudinary.uploadImageToCloudinary(file.buffer)
            );
            const newImageUrls = await Promise.all(uploadPromises);
            imageUrls.push(...newImageUrls);
        }

        const updatedBook = await Booklisting.findByIdAndUpdate(
            id,
            {
                book_title,
                author_name,
                description,
                cover_image: coverImageUrl,
                images: imageUrls,
            },
            { new: true }
        );

        if (!updatedBook) {
            return handleResponse(res, 404, "Book not found.");
        }

        req.event = updatedBook;

        return handleResponse(res, 200, "Book details updated successfully.", updatedBook);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, "Error updating book details data", error.message);
    }
};


// exports.updateBookDetails = async (req, res, next) => {

//     const { error } = bookListingSchema.validate(req.body);
//     if (error) {
//         return handleResponse(res, 400, error.details[0].message);
//     }
//     const { id } = req.params;
//     try {
//         const { book_title, author_name, description } = req.body;


//         let existingBook = null;
//         if (id) {
//             existingBook = await Booklisting.findById(id);
//             if (!existingBook) {
//                 return handleResponse(res, 404, "Book Details not found with provided id");
//             }
//         }


//         let removeImages = [];
//         if (req.body.removeImages) {
//             try {
//                 removeImages = JSON.parse(req.body.removeImages);
//             } catch (error) {
//                 return handleResponse(res, 400, "Invalid removeImages format. Must be a JSON array.");
//             }
//         }

//         let imageUrls = existingBook ? [...existingBook.images] : [];


//         if (Array.isArray(removeImages)) {
//             imageUrls = imageUrls.filter((img) => !removeImages.includes(img));
//         }


//         if (req.files && req.files.length > 0) {
//             const uploadPromises = req.files.map((file) =>
//                 cloudinary.uploadImageToCloudinary(file.buffer)
//             );
//             const newImageUrls = await Promise.all(uploadPromises);
//             imageUrls.push(...newImageUrls);
//         }


//         const imageUrl = await cloudinary.uploadImageToCloudinary(req.file.buffer);

//         const updatedBook = await Booklisting.findByIdAndUpdate(
//             id,
//             {
//                 book_title,
//                 author_name,
//                 description,
//                 cover_image:imageUrl,
//                 images: imageUrls,
//             },
//             { new: true }
//         );

//         if (!updatedBook) {
//             return handleResponse(res, 404, "Book not found.");
//         }
//         req.event = updatedBook;

//         return handleResponse(res, 200, "Book details updated successfully.", updatedBook);
//     } catch (error) {
//         console.error(error);
//         return handleResponse(res, 500, "Error updating book details data", error.message);
//     }
// };

exports.deleteBookDetails = async (req, res) => {
    try {
        const data = await Booklisting.findByIdAndDelete(req.params.id);
        if (!data) {
            return handleResponse(res, 404, "Book details not found");
        }

        return handleResponse(res, 200, "Book details deleted successfully", data);
    } catch (error) {
        return handleResponse(res, 500, "Error deleting Book details ", error.message);
    }
};
