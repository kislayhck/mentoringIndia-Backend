const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // console.log(req.headers);
    if (req.headers.authorization === undefined)
      return res.status(401).json({ message: "User not authenticated"});
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY,
    );
    if (decodedToken)
      next();
    else {
      res.status(401).json({ message: "User Unauthorized"})
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Auth failed!" });
  }
};