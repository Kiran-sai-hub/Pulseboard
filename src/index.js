import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import ENV_VARS from "./config/envVars.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Importing and using auth routes
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);

// Global error handler
app.use(errorHandler);

connectDB()
  .then(() => {
    const PORT = ENV_VARS.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
