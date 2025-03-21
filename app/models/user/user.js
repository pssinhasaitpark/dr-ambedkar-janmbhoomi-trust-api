
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    user_role: {
        type: String,
        enum: ['user','admin','super-admin','trustees']  
        },
    user_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    full_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    designations:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    isUsed: { type: Boolean }
},
    {
        timestamps: true,
    });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;  