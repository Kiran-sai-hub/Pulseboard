import mongoose from "mongoose";

const dataSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["database", "api", "file"],
    },
    updateFrequency: {
      type: Number,
      default: 15, // in minutes
    },
    lastUpdatedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    mockData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

dataSourceSchema.index({ owner: 1, name: 1 }, { unique: true });

const DataSource = mongoose.model("DataSource", dataSourceSchema);
export default DataSource;
