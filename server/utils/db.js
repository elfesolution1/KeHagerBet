const mongoose = require("mongoose");

module.exports.dbConnect = async () => {
  try {
    if (process.env.mode === "pro") {
      await mongoose.connect(process.env.DB_URL, { useNewURLParser: true });
      console.log("database connect....");
    } else {
      await mongoose.connect(process.env.DB_URL, { useNewURLParser: true });
      console.log("database connect....");
    }
  } catch (error) {
    console.log(error.message);
  }
};
