const express = require("express"),
      router = express.Router(),
      authentication = require('../middlewares/auth');

const {
  viewQuestion,
  createQuestion,
  editQuestion,
  deleteQuestion,
  userQuestion
} = require('../controllers/qa');

router.route('/view-question').post(authentication, viewQuestion);
router.route('/add-question').post(authentication, createQuestion);
router.route('/edit-question/:_id').put(authentication, editQuestion);
router.route('/delete-question/:_id').delete(authentication, deleteQuestion);
router.route('/view-questions').get(userQuestion);

module.exports = router;