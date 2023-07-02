const express = require("express"),
      router = express.Router(),
      authentication = require('../middlewares/auth');

const {
  getData,
  logout
} = require('../controllers/timeout');

router.route('/get-activity').post(authentication, getData);
router.route('/logout/:_id').put(logout);

module.exports = router;