import nodemailer from "nodemailer";
import ENV_VARS from "../config/envVars.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV_VARS.EMAIL_USER,
    pass: ENV_VARS.EMAIL_PASS,
  },
});

export const sendAlertEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
        from: `PulseBoard Alerts <${ENV_VARS.EMAIL_USER}>`,
        to,
        subject,
        text: message,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending alert email:", error.message);
    return false;
  }
};
