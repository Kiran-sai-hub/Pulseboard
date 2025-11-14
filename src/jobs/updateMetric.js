import cron from "node-cron";
import MetricCard from "../models/metricCard.model.js";
import DataSource from "../models/dataSource.model.js";
import { getMetricStatus } from "../utils/statusCalc.js";
import Alert from "../models/alert.model.js";

/**
 * Generates mock data value with some randomness
 */
const generateMockValue = (currentValue, threshold) => {
  // Generate value between 0.7 * threshold and 1.3 * threshold for variation
  const min = threshold * 0.7;
  const max = threshold * 1.3;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Updates all metric cards with mock data from their data sources
 */
export const updateMetricsJob = async () => {
  try {
    console.log("Running metric update job...");

    // Find all active data sources with mock data
    const dataSources = await DataSource.find({
      isActive: true,
      mockData: { $exists: true, $ne: {} },
    });

    if (dataSources.length === 0) {
      console.log("No active data sources with mock data found");
      return;
    }

    // Get all metric cards associated with these data sources
    const dataSourceIds = dataSources.map((ds) => ds._id);
    const metricCards = await MetricCard.find({
      dataSource: { $in: dataSourceIds },
    });

    console.log(`Updating ${metricCards.length} metric cards...`);

    let updatedCount = 0;
    let alertCount = 0;

    for (const metricCard of metricCards) {
      const dataSource = dataSources.find(
        (ds) => ds._id.toString() === metricCard.dataSource.toString()
      );

      if (!dataSource) continue;

      const newValue = generateMockValue(
        metricCard.value,
        metricCard.threshold
      );

      metricCard.value = newValue;
      metricCard.lastUpdatedAt = Date.now();

      const newStatus = getMetricStatus(newValue, metricCard.threshold);
      const statusChanged = metricCard.status !== newStatus;
      metricCard.status = newStatus;

      await metricCard.save();
      updatedCount++;

      if (newStatus !== "normal") {
        alertCount++;
        // TODO: Generate alert document
        // - Create Alert model with fields: metricCard, status, value, threshold, timestamp
        // - Save alert to database
        // - Optionally send notification (email, webhook, etc.)
        const newAlert = await Alert.create({
            metricCard: metricCard._id,
            status: newStatus,
            value: newValue,
            threshold: metricCard.threshold,
            triggeredAt: Date.now(),
            owner: metricCard.owner,
            sent: false,
        });

        console.log(
          `Alert: Metric "${metricCard.title}" is ${newStatus} (value: ${newValue}, threshold: ${metricCard.threshold})`
        );
      }

      if (statusChanged) {
        console.log(
          `Status changed for "${metricCard.title}": ${metricCard.status}`
        );
      }
    }

    console.log(
      `Metric update completed: ${updatedCount} updated, ${alertCount} alerts`
    );
  } catch (error) {
    console.error("Error updating metrics:", error);
  }
};

/**
 * Schedule the job to run every 5 minutes
 * Cron pattern: "{star}/5 * * * *" means "every 5 minutes"
 */
export const scheduleMetricUpdates = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", updateMetricsJob);
  console.log("Metric update job scheduled (every 5 minutes)");
};

// For manual testing/triggering
export const runMetricUpdateNow = async () => {
  console.log("Manually triggering metric update...");
  await updateMetricsJob();
};
