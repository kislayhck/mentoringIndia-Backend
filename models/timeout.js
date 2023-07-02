const mongoose = require("mongoose");

const Timeout_Schema = new mongoose.Schema({
  
  name: String,
  email: String,
  logindate: String,
  logoutdate: String,
  logouttime: String,
  role: String,
  logintime: String,
  ipaddress: String,
  browser: String,
  totaltime: String

},
  { timestamps: true }
);


module.exports = mongoose.model('Timeout', Timeout_Schema);