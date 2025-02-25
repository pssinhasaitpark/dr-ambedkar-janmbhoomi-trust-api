const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
    user_role: {
        type: String,
        enum: ['user', 'admin', 'super-admin', 'trustees'], // Enum for valid roles
        required: true, // Ensure the role is always provided
    },
    user_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,  // Ensures email is unique
        lowercase: true, // Stores email in lowercase
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],  // Simple email regex validation
    },
    mobile: {
        type: String,
        required: true,
        unique: true,  // Ensure the mobile number is unique
    },
    password: {
        type: String,
        required: true,
    },
    designations: {
        type: String,
        required: true,
    },
    profile_image: {
        type: String,
    }
},
    {
        timestamps: true,
    });

// Password hashing before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash the password if it's modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Create User model
const User = mongoose.model('User', userSchema);
module.exports = User;


// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//     user_role: {
//         type: String,
//         enum: ['user','admin','super-admin','trustees']  
//         },
//     user_name: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     first_name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     last_name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     email: {
//         type: String,
//         trim: true,
//     },
//     mobile: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     designations:{
//         type:String,
//         required:true
//     },
//     profile_image:{
//         type:String
//     }
// },
//     {
//         timestamps: true,
//     });

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next(); 
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// userSchema.methods.comparePassword = function (password) {
//     return bcrypt.compare(password, this.password);
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;  