const express = require("express"),
      router = express.Router()
      authentication = require('../middlewares/auth');

const {
  createUser,
  getSales,
  getMentor,
  signIn,
  delUser,
  sendOtp,
  verifyOtp,
  updatePwd,
  changeRole,
  loadData
} = require("../controllers/user");


// CRM Routes
router.route('/add-person').post(createUser);
router.route('/sales').post(authentication, getSales);
router.route('/mentor').post(authentication, getMentor);
router.route('/sign-in').post(signIn);
router.route('/del-user/:_id').delete(authentication, delUser);
router.route('/forgot-password').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/update-pwd').put(updatePwd);
router.route('/changeRole/:_id').put(authentication, changeRole);


// Main Website Routes
router.route('/load-data/:_id').post(loadData);

module.exports = router;