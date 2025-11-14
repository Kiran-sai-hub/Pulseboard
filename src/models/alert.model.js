import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    metricCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MetricCard",
      required: true,
    },
    status: {
      type: String,
      enum: ["warning", "critical"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    triggeredAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

alertSchema.index({ metricCard: 1, triggeredAt: -1 });

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
