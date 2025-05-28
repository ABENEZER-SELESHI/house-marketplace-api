const axios = require('axios');
const Payment = require('../models/Payment.js');
const House = require('../models/House.js');

const checkout = async (req, res) => {
  const { houseId, amount } = req.body;

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'House not found' });

    const chapaResponse = await initializeTransaction({
      amount,
      email: req.user.email,
      first_name: req.user.firstName,
      last_name: req.user.lastName,
      phone_number: `+251${req.user.phoneNumber}`,
    });

    const payment = new Payment({
      buyer: req.user.id,
      house: houseId,
      amount,
      status: 'pending',
      chapa_tx_ref: chapaResponse.data.tx_ref,
    });

    await payment.save();

    res.status(201).json({ paymentId: payment._id, paymentLink: chapaResponse.data.checkout_url });
  } catch (error) {
    console.error('Checkout error:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  const { paymentId } = req.body;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const verification = await verifyTransaction(payment.chapa_tx_ref);

    if (verification.data.status === 'success') {
      payment.status = 'completed';
      await payment.save();
      return res.status(200).json({ message: 'Payment confirmed' });
    } else {
      return res.status(400).json({ message: 'Payment not verified' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const initializeTransaction = async ({ amount, email, first_name, last_name, phone_number }) => {
  const options = {
    method: 'POST',
    url: 'https://api.chapa.co/v1/transaction/initialize',
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    data: {
      amount,
      currency: 'ETB',
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref: `tx_${Date.now()}`,
      callback_url: 'http://localhost:4000/api/payments/callback',
      return_url: 'http://localhost:4000/api/houses',
      customization: {
        title: 'House Purchase',
        description: 'Payment for house purchase',
      },
      // subaccounts: [
      //   {
      //     id: `${process.env.CHAP_SUBACCOUNT_ID}`,
      //     split_type: 'percentage',
      //     split_value: 0.95,
      //   },
      // ],
    },
  };
  // console.log('Loaded subaccount ID:', process.env.CHAP_SUBACCOUNT_ID);
  const response = await axios(options);
  return response.data;
};

const verifyTransaction = async (tx_ref) => {
  const options = {
    method: 'GET',
    url: `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  };

  const response = await axios(options);
  return response.data;
};

const createSubaccountHandler = async (req, res) => {
  try {
    const { business_name, account_name, bank_code, account_number } = req.body;

    const options = {
      method: 'POST',
      url: 'https://api.chapa.co/v1/subaccount',
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        business_name,
        account_name,
        bank_code,
        account_number,
        split_type: 'percentage',
        split_value: 0.95,
      },
    };

    const response = await axios(options);
    return res.status(201).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const callbackHandler = async (req, res) => {
  const { trx_ref, status } = req.query;

  if (!trx_ref || !status) {
    return res.status(400).json({ message: 'Missing trx_ref or status' });
  }

  try {
    const chapaVerification = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${trx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaData = chapaVerification.data;

    if (chapaData.status === 'success' && chapaData.data.status === 'success') {
      const payment = await Payment.findOne({ chapa_tx_ref: trx_ref });

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      payment.status = 'completed';
      await payment.save();

      return res.status(200).json({ message: 'Payment verified and updated' });
    } else {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Callback error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// const webhookHandler = async (req, res) => {
//   const event = req.body;

//   console.log('Received Chapa webhook:', event);

//   try {
//     if (event.event === 'payment.success' && event.reference) {
//       const payment = await Payment.findOne({ chapa_tx_ref: event.reference });

//       if (!payment) {
//         return res.status(404).json({ message: 'Payment not found' });
//       }

//       payment.status = 'completed';
//       await payment.save();

//       return res.status(200).json({ message: 'Payment updated via webhook' });
//     }

//     return res.status(400).json({ message: 'Unhandled event type or missing reference' });
//   } catch (error) {
//     console.error('Webhook processing error:', error.message);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


module.exports = {
  checkout,
  confirmPayment,
  createSubaccountHandler,
  initializeTransaction,
  verifyTransaction,
  callbackHandler,
  // webhookHandler,
};
