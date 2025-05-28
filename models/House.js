//models/House.js
const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullViewPicture: String,
    roomPictures: [String],
    numRooms: Number,
    numBedrooms: Number,
    areaSize: Number,
    location: {
        address: String,
        district: String, 
        city: { type: String, default: 'Addis Ababa' },
        state: { type: String, default: 'Addis Ababa' },
        country: { type: String, default: 'Ethiopia' },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    price: Number,
    rentOrSale: { type: String, enum: ['rent', 'sale'], required: true },
    specialRequirements: String,
    status: { type: String, enum: ['available', 'rented', 'sold'], default: 'available' },
    amenities: [String], // e.g. ['wifi', 'parking', 'balcony']
    furnished: { type: Boolean, default: false },
    yearBuilt: Number,
    isVerified: { type: Boolean, default: true }
}, { timestamps: true });


houseSchema.index({ 'location.address': 'text', price: 1 });

module.exports = mongoose.model('House', houseSchema);

