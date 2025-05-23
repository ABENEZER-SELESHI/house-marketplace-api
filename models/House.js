//models/House.js
const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullViewPicture: String,
    roomPictures: [String],
    numRooms: Number,
    price: Number,
    specialRequirements: String,
    status: { type: String, enum: ['available', 'rented', 'sold'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
