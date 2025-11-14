import cron from "node-cron";
import Alert from "../models/alert.model.js";
import { sendAlertEmail } from "../services/mailer.js";

export const sendAlertEmailsJob = async () => {
  try {
    console.log("Checking for unsent alerts...");

    const alerts = await Alert.find({ sent: false })
      .populate("metricCard", "title")
      .populate("owner", "email name");

    if (!alerts.length) {
      console.log("No pending alerts to send.");
      return;
    }

    for (const alert of alerts) {
      const userEmail = alert.owner?.email;
      if (!userEmail) continue;

      const subject = `[PulseBoard] ${alert.status.toUpperCase()} Alert: ${alert.metricCard.title}`;
      const message = `Your metric "${alert.metricCard.title}" has a value of ${alert.value} (threshold: ${alert.threshold}). Status: ${alert.status.toUpperCase()}.`;

      const sent = await sendAlertEmail(userEmail, subject, message);

      if (sent) {
        alert.sent = true;
        await alert.save();
      }
    }

    console.log(`Alert email job completed. Sent ${alerts.length} emails.`);
  } catch (err) {
    console.error("Error in sendAlertEmailsJob:", err);
  }
};

// Run every 2 minutes
cron.schedule("*/2 * * * *", sendAlertEmailsJob);
console.log("Email alert job scheduled (every 2 minutes)");
