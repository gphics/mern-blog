const mongoose = require("mongoose");



async function dbConnect() {
  try {
    await mongoose.connect(process.env.mainUrl);
    console.log("db connected ....");
  } catch (error) {
    console.log(error);
  }
}

dbConnect();
