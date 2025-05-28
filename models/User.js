//models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    phoneNumber: Number,
    role: { 
        type: String, 
        enum: ['admin', 'seller', 'buyer'], 
        default: 'buyer' 
    },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
