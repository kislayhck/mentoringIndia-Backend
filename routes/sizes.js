const Register = require('../models/user'),
      Paid = require('../models/paid'),
      Student = require('../models/students'),
      express = require('express'),
      authentication = require('../middlewares/auth'),
      app = express();

app.get('/sizes', authentication, async (req, res) => {
  try {
    const m = await Register.countDocuments({role: "mentor"}),
    s = await Register.countDocuments({role: "sales"}),
    st = await Student.countDocuments(),
    pd = await Paid.countDocuments();
    // console.log(m, s, st, pd);
    return res.status(200).json({m, s, st, pd});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An Error Occured!" });
  }
});

module.exports = app;