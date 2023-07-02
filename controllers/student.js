const Student = require('../models/students');

const createUser = async (req, res) => {
  try {
    const newUser = new Student(req.body);
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
}

const getStudents = async (req, res) => {
  try {
    const {
      classes,
      city,
      state
    } = req.body;
    
    if (classes === 0 && city === '' && state === '') { // No Filter
      const students = await Student.find({}).sort({assignto: 1});
      // console.log(students);
      return res.status(200).json(students);
    } else if (classes !== 0 && city === '' && state === '') { // Only Class Filter Applied
      const students = await Student.find({classes: classes}).sort({assignto: 1});
      return res.status(200).json(students);
    } else if (classes === 0) { // State of City+State filter
      if (city === '') { // Only State
        const students = await Student.find({state: state}).sort({assignto: 1});
        return res.status(200).json(students);
      } else { // State & City
        const students = await Student.find({state: state, city: city}).sort({assignto: 1});
        return res.status(200).json(students);
      }
    } else {
      if (city === '') { // Only State
        const students = await Student.find({state: state, classes: classes}).sort({assignto: 1});
        return res.status(200).json(students);
      } else { // State & City
        const students = await Student.find({state: state, city: city, classes: classes}).sort({assignto: 1});
        return res.status(200).json(students);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json(error)
  }
}

const assigned = async (req, res) => {
  try {
    const stud = await Student.findByIdAndUpdate(req.params._id, req.body);
		await stud.save();
		return res.status(201).send(stud);
  } catch(err) {
    console.log(err);
    return res.status(406).send(stud);
  }
}

const delUser = async (req, res) => {
  try {
    const user = await Student.deleteOne({_id: req.params._id});
    if (!user) res.status(404).send('No user found');
    return res.status(200).json({msg: "User Deleted"});
  } catch (error) {
    console.log(error);
    return res.status(303).send();
  }
}

const listUser = async (req, res) => {
  try {
    const {
      classes,
      city,
      state
    } = req.body;

    const _id = req.params._id;
    if (classes == '0' && city === '' && state === '') { // No Filter
      const students = await Student.find({assignto: _id});
      // console.log(students);
      return res.status(200).json(students);
    } else if (classes !== '0' && city === '' && state === '') { // Only Class Filter Applied
      const students = await Student.find({classes: classes, assignto: _id});
      return res.status(200).json(students);
    } else if (classes === '0') { // State of City+State filter
      if (city === '') { // Only State
        const students = await Student.find({state: state, assignto: _id});
        return res.status(200).json(students);
      } else { // State & City
        const students = await Student.find({state: state, city: city, assignto: _id});
        return res.status(200).json(students);
      }
    } else {
      if (city === '') { // Only State
        const students = await Student.find({state: state, classes: classes, assignto: _id});
        return res.status(200).json(students);
      } else { // State & City
        const students = await Student.find({state: state, city: city, classes: classes, assignto: _id});
        return res.status(200).json(students);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

const sendOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Student.findOne({ email: email });
    if (!user) {
      return res.status(404).json({msg: "User doesn\'t exist!!"});
    }
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChar: false });
    const expiresIn = new Date().getTime() + 3*60*1000;
    const user2 = await Student.findByIdAndUpdate(user._id, { otp: otp, expiresIn: expiresIn });
		await user2.save();
    sendMail(email, otp);
    return res.status(201).json({msg: "OTP sent on email"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: "An error Occured!"});
  }
}

const sendMail = (email, otp) => {
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

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent successfully');
      }
    });

  } catch (error) {
    console.log(error);
  }
}

const verifyOtp = async (req, res) => {
  try {
    const {
      email,
      otp,
      expiresIn
    } = req.body;
    const user = await Student.findOne({ email: email });
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
    let user = await Student.findOne({ email: req.body.email });
    user.pwd = req.body.pwd;
    await user.save(); 
    return res.status(201).json({msg: "Password Updated!!"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg: "An Error Occured!!"});
  }
}

const signIn = async (req, res) => {
  try {
    const {
      email,
      pwd
    } = req.body;
    // console.log(req.body);

    const user = await Student.findOne({ email });
    if (user) {
      const cond = await user.matchPassword(pwd);
      // console.log(cond);
      if (cond) {
        const token = await user.genAuthToken();
        // console.log(token);
        
        return res.status(200).json({token: token, user});
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

module.exports = {
  createUser,
  getStudents,
  assigned,
  delUser,
  listUser,
  sendOtp,
  verifyOtp,
  updatePwd,
  signIn
};