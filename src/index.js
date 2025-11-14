import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from "./config/db.js";
import ENV_VARS from "./config/envVars.js";
import errorHandler from "./middlewares/errorHandler.js";
import { scheduleMetricUpdates } from "./jobs/updateMetric.js";
import "./jobs/sendAlertEmails.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Importing and using auth routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

// importing and using data source routes
import dataSourceRoutes from "./routes/dataSource.routes.js";
app.use("/api/data-sources", dataSourceRoutes);

// Importing and using metricCard routes
import metricCardRoutes from "./routes/metricCard.routes.js";
app.use("/api/metric-cards", metricCardRoutes);

// Global error handler
app.use(errorHandler);

connectDB()
  .then(() => {
    const PORT = ENV_VARS.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      
      scheduleMetricUpdates();
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
