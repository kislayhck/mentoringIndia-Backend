const mongoose = require("mongoose"),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');

const Reg_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  pwd: {
    type: String,
    required: true,
    minlength: [6, "Password should be greater than 6 characters"]
  },
  role: {
    type: String,
    required: true
  },
  // id: {
  //   type: Number,
  //   required: true
  // },
  otp: String,
  expiresIn: Number,
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
},
  { timestamps: true }
);

// before saving the user object we need to hash its password
Reg_Schema.pre('save', async function (next) {
  if(!this.isModified('pwd'))   // checking the password modified or not
    next();
    
  const salt = await bcrypt.genSalt(10);    // generates a random text salt for use
  this.pwd = await bcrypt.hash(this.pwd, salt);   // hashing the password
});

// method to match password
Reg_Schema.methods.matchPassword = async function (pwd) {
  const x = await bcrypt.compare(pwd, this.pwd);
  // console.log(x);
  return x;   // returns boolean value after comparison
}

// JWT Token Generation
Reg_Schema.methods.genAuthToken = async function () {
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

module.exports = mongoose.model('Register', Reg_Schema);