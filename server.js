require("dotenv").config();

const express = require("express"),
      db = require("./config/db.js"),
      cors = require("cors"),
      user = require('./routes/user'),
      student = require('./routes/student'),
      paid = require('./routes/paid'),
      razorpay = require('./routes/razorpay'),
      header = require('./config/header'),
      sizes = require('./routes/sizes'),
      timeout = require('./routes/timeout'),
      useragent = require('express-useragent'),
      qa = require('./routes/qa');

const app = express();



app.use(cors());
app.use(express.json());
app.use(header);
app.use(express.urlencoded({ extended: false }));
app.use(useragent.express());



app.use('/razorpay', razorpay);
app.use('/user', user);
app.use('/student', student);
app.use('/paid', paid);
app.use('/length', sizes);
app.use('/timeout', timeout);
app.use('/qa', qa);

// Connecting Database
db();

const PORT = process.env.PORT || 5500;

// For Heroku Setup
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

app.get('/', (req, res) => res.send('Mentoring India Server'));

// Starting Server
app.listen(
  PORT,
  console.log(`Server started at Port ${PORT}`)
);