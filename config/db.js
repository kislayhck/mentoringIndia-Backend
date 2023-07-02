const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const DB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`Connected to database ${conn.connection.name}`);
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = DB;