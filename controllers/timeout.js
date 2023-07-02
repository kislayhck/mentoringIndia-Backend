const Timeout = require('../models/timeout');

const getData = async (req, res) => {
  try {
    if (req.body.sdate === undefined || req.body.edate === undefined) {
      req.body.sdate = new Date(2022, 1, 15, 0, 0, 0).toISOString().substring(0, 10);
      req.body.edate = new Date().toISOString().substring(0, 10);
    }

    if (req.body.name === '') {
      const activity = await Timeout.find({ logindate: { $gte: req.body.sdate, $lte: req.body.edate } }).sort({ 'logindate': -1, 'logintime': -1 });
      return res.status(200).send(activity);
    }
    else {
      const activity = await Timeout.find({ name: req.body.name, createdAt: { $gte: req.body.sdate, $lte: req.body.edate } }).sort({ 'logindate': -1, 'logintime': -1 });
      return res.status(200).send(activity);
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(error);
  }
}

const logout = async (req, res) => {
  try {
    let user = await Timeout.findById({ _id: req.params._id });
    const date = new Date();
    user.logouttime = date.toLocaleTimeString();
    user.logoutdate = date.toLocaleDateString();
    const diff = (new Date(date) - new Date(user.createdAt))/(1000*60);
    user.totaltime = diff;
    await user.save();
    return res.status(201).json({ msg: "Logout Successfull!!" });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
}

module.exports = {
  getData,
  logout
};