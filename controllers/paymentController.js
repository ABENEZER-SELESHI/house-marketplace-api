// controllers/paymentController.js
const Payment = require('../models/Payment.js');
const House = require('../models/House.js');
// Assume you will connect this later with Stripe or Chapa

const checkout = async (req, res) => {
    const { houseId, amount } = req.body;
    try {
        const house = await House.findById(houseId);
        if (!house) return res.status(404).json({ message: 'House not found' });

        const payment = new Payment({
            buyer: req.user.id,
            house: houseId,
            amount,
            status: 'pending',
        });

        await payment.save();

        res.status(201).json({ paymentId: payment._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const confirmPayment = async (req, res) => {
    const { paymentId } = req.body;
    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        payment.status = 'completed';
        await payment.save();

        res.status(200).json({ message: 'Payment confirmed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkout,
    confirmPayment,
};