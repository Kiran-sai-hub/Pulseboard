import dotenv from "dotenv";
dotenv.config();

const ENV_VARS = {
  DB_URL: process.env.DB_URL || "",
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

export default ENV_VARS;
