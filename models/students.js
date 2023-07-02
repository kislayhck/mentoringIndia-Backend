const mongoose = require("mongoose"),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');

const Student_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phn: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  classes: {
    type: Number,
    required: true
  },
  assignto: {
    type: String,
    default: 0
  },
  pwd: {
    type: String
  },
  score: {
    type: Number,
    default: 0
  },
  otp: String,
  expiresIn: Number
},
  { timestamps: true }
);


// before saving the user object we need to hash its password
Student_Schema.pre('save', async function (next) {
  if(!this.isModified('pwd'))   // checking the password modified or not
    next();
    
  const salt = await bcrypt.genSalt(10);    // generates a random text salt for use
  this.pwd = await bcrypt.hash(this.pwd, salt);   // hashing the password
});

// method to match password
Student_Schema.methods.matchPassword = async function (pwd) {
  const x = await bcrypt.compare(pwd, this.pwd);
  // console.log(x);
  return x;   // returns boolean value after comparison
}

// JWT Token Generation
Student_Schema.methods.genAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id }, // payload
      process.env.SECRET_KEY, //secretkey
      { expiresIn: "28d" }, //expire duration 
    ); 
    this.tokens = [];
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
}

module.exports = mongoose.model('Student', Student_Schema);
