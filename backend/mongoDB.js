const mongoose = require("mongoose");
const url = process.env.url;

const mongoDB = async () => {
  try {
    mongoose.connect(url);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop execution if connection fails
  }
};

let db = (mongoose.connection = mongoDB());

module.exports = db;
