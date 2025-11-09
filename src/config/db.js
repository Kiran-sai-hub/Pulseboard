import mongoose from "mongoose";
import ENV_VARS from "./envVars.js";

const url = ENV_VARS.DB_URL;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log("MongoDB connected successfully, DB: " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
