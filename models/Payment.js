const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    house: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
    amount: Number,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
