const mongoose = require("mongoose");
const TaskSubmission = require("../models/TaskSubmisionSchema");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // await TaskSubmission.syncIndexes();
    // console.log(" TaskSubmission indexes synced");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop the app
  }
};

module.exports = connectDB;
