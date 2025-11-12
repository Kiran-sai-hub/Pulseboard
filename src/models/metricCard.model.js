import mongoose from "mongoose";

const metricCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dataSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataSource",
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
    },
    threshold: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["normal", "warning", "critical"],
      default: "normal",
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MetricCard = mongoose.model("MetricCard", metricCardSchema);
export default MetricCard;
