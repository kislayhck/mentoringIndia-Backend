require('dotenv').config();
const Razorpay = require('razorpay'),
      Paid = require('../models/paid');

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const payment = async (req, res) => {

  const payment_capture = 1,
        amount = 99,
        currency = "INR";

  const options = {
    amount: (amount * 100),
    currency,
    receipt: "receipt#1",
    payment_capture
  }

  // console.log(options);

  try {
    const response = await instance.orders.create( options );
    // console.log(response);
    res.status(200).json({
      id: response.id,
      amount: response.amount,
      currency: response.currency
    });
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  payment
};