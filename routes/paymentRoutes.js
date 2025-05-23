// routes/paymentsRoutes.js
const express = require('express');
const { checkout, confirmPayment } = require('../controllers/paymentController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/checkout', protect, checkout);
router.post('/confirm', protect, confirmPayment);

module.exports = router;
