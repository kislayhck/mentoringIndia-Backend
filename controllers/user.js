const Register = require('../models/user'),
      otpGenerator = require('otp-generators'),
      nodemailer = require('nodemailer'),
      Timeout = require('../models/timeout'),
      ip = require('ip');

const createUser = async (req, res) => {
  try {

    if (await Register.countDocuments({ email: req.body.email }) !== 0) {
      return res.status(406).json({msg: "Email Already Exists!\nTry logging In!!"});
    }

    if (req.body.pwd.length < 6) {
      return res.status(400).json({msg: "Password too short!"});
    }

    // if (req.body.role === "mentor") {
    //   if (await Register.countDocuments({role: "mentor"}) === 0) {
    //     req.body.id = 1;
    //   }
    //   else {
    //     const id = await Register.findOne({role: "mentor"}).sort({id: -1});
    //     req.body.id = id.id+1;
    //   }
    // }
    // else if (req.body.role === "sales") {
    //   if (await Register.countDocuments({role: "sales"}) === 0) {
    //     req.body.id = 1;
    //   }
    //   else {
    //     const id = await Register.findOne({role: "sales"}).sort({id: -1});
    //     req.body.id = id.id+1;
    //   }
    // }
    // else {
    //   if (await Register.countDocuments({role: "admin"}) === 0) {
    //     req.body.id = 1;
    //   }
    //   else {
    //     const id = await Register.findOne({role: "admin"}).sort({id: -1});
    //     req.body.id = id.id+1;
    //   }
    // }

    const newUser = new Register(req.body);
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}

const getSales = async (req, res) => {
  try {
    if (req.body.sdate === undefined || req.body.edate === undefined) {
      req.body.sdate = new Date(2022, 1, 15, 0, 0, 0).toISOString().substring(0, 10);
      req.body.edate = new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10);
    }
    const sales = await Register.find({role: "sales", createdAt: { $gte: req.body.sdate, $lte: req.body.edate }});
    return res.status(200).send(sales);
  } catch (error) {
    console.log(error);
    return res.status(404).send(error)
  }
}

const getMentor = async (req, res) => {
  try {
    if (req.body.sdate === undefined || req.body.edate === undefined) {
      req.body.sdate = new Date(2022, 1, 15, 0, 0, 0).toISOString().substring(0, 10);
      req.body.edate = new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10);
    }
    const mentor = await Register.find({role: "mentor", createdAt: { $gte: req.body.sdate, $lte: req.body.edate }});
    // console.log(mentor);
    return res.status(200).send(mentor);
  } catch(err) {
    console.log(err);
    return res.status(404).send(err);
  }
}

const signIn = async (req, res) => {
  try {
    const {
      email,
      pwd
    } = req.body;

    const user = await Register.findOne({ email });
    if (user) {
      const cond = await user.matchPassword(pwd);
      // console.log(cond);
      if (cond) {
        const token = await user.genAuthToken();
        // console.log(token);
        const s = await timeddb(user, req.useragent.browser);
        if (s === -1)
          return res.status(300).json({ msg: "Failed to save session timeout!" });
        else  
          return res.status(200).json({token: token, user, s});
      }
      else {
        return res.status(401).json({msg: 'Invalid Credential'});
      }
    }
    else {
      return res.status(404).json({msg: 'User does\'nt Exist'});
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: 'An Error Occured!'});
  }
}

const timeddb = async (user, browser) => {

  try {  
    const dt = new Date(),
          date = dt.toISOString().substring(0, 10),
          time = dt.toLocaleTimeString();

    const body = {
      name: user.name,
      email: user.email,
      logindate: date,
      logintime: time,
      role: user.role,
      ipaddress: ip.address(),
      browser
    };
    const newUser = new Timeout(body);
    await newUser.save();
    return newUser;
    // console.log(body);
  } catch(err) {
    console.log(err);
    return -1;
  }
}

const delUser = async (req, res) => {
  try {
    const user = await Register.deleteOne({_id: req.params._id});
    if (!user) return res.status(404).send('No user found');
    return res.status(200).json({msg: "User Deleted"});
  } catch (error) {
    console.log(error);
    return res.status(303).send();
  }
}

const sendOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Register.findOne({ email: email });
    if (!user) {
      return res.status(404).json({msg: "User doesn\'t exist!!"});
    }
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChar: false });
    const expiresIn = new Date().getTime() + 3*60*1000;
    const user2 = await Register.findByIdAndUpdate(user._id, { otp: otp, expiresIn: expiresIn });
		await user2.save();
    const x = await sendMail(email, otp);
    if (x)
      return res.status(201).json({msg: "OTP sent on email"});
    else 
      return res.status(403).json({msg: "An Error Occured"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: "An error Occured!"});
  }
}

const sendMail = async (email, otp) => {
  try {
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      // host: 'smtp.ethereal.email',
      // port: 587,
      // host: "smtp.zoho.com",
      // port: 465,
      // secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PWD
      }
    });

    let mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<h2>OTP: ${otp}</h2><p>Enter OTP within 3 minutes before it expires.</p>`
    };

    const success = await mailTransporter.sendMail(mailDetails);
    return success;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const verifyOtp = async (req, res) => {
  try {
    const {
      email,
      otp,
      expiresIn
    } = req.body;
    const user = await Register.findOne({ email: email });
    if (user.expiresIn <= expiresIn) {
      return res.status(408).json({msg: 'Code Expired!\nTry Again!'});
    } else if (user.otp !== otp) {
      return res.status(406).json({msg: 'Incorrect OTP'});
    } else {
      return res.status(200).json({msg: 'OTP Verified!!'});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: 'An error Occured!'});
  }
}

const updatePwd = async (req, res) => {
  try {
    let user = await Register.findOne({ email: req.body.email });
    user.pwd = req.body.pwd;
    await user.save(); 
    return res.status(201).json({msg: "Password Updated!!"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: "An Error Occured!!"});
  }
}

const changeRole = async (req, res) => {
  try {
    let user = await Register.findById({ _id: req.params._id });
    user.role = req.body.role;
    await user.save();
    return res.status(201).json({ msg: "Role Changed!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Something went wrong!\nTry again later!!"});
  }
}


// Main Website
const loadData = async (req, res) => {
  try {
    const mentor = await Register.findById(req.params._id);
    if (mentor)
      return res.status(200).json(mentor);
    else
      return res.status(404).json({msg: "Mentor not Found!"});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
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
};