// routes/paymentsRoutes.js
const express = require('express');
const { checkout, confirmPayment, callbackHandler, webhookHandler } = require('../controllers/paymentController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/checkout', protect, checkout);
router.post('/confirm', protect, confirmPayment);
router.get('/callback', callbackHandler);
router.post('/webhook', express.json(), webhookHandler);

module.exports = router;
