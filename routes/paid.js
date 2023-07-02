const express = require("express"),
      router = express.Router(),
      authentication = require('../middlewares/auth');

const {
  createUser,
  getStudents,
  assigned,
  delUser,
  listUser,
  sendOtp,
  verifyOtp,
  updatePwd,
  signIn,
  loadData
} = require("../controllers/paid");


// CRM Routes
router.route('/add-student').post(createUser);
router.route('/get-students').post(authentication, getStudents);
router.route('/assignSales/:_id').put(authentication, assigned);
router.route('/del-user/:_id').delete(authentication, delUser);
router.route('/assigned-show/:_id').post(authentication, listUser);
router.route('/forgot-password').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/update-pwd').put(updatePwd);


// Main Website Routes
router.route('/sign-in').post(signIn);
router.route('/load-data/:_id').post(authentication, loadData);

module.exports = router;