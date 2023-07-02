const express = require('express'),
      router = express.Router();


const {
  payment
} = require('../controllers/razorpay');

router.route('/razorpay').post(payment);

module.exports = router;