import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import MetricCard from "../models/metricCard.model.js";
import DataSource from "../models/dataSource.model.js";

const createMetricCard = asyncHandler(async (req, res) => {
  const { title, dataSource, value, unit, threshold } = req.body;

  if (!title || !dataSource || value === undefined || threshold === undefined) {
    throw new ApiError(
      400,
      "Title, Data Source, Value, and Threshold are required"
    );
  }

  const dataSourceObj = await DataSource.findOne({
    _id: dataSource,
    owner: req.user._id,
  });
  if (!dataSourceObj) {
    throw new ApiError(
      404,
      "Data Source not found or you do not have permission to access it"
    );
  }

  let status = "normal";
  if (threshold !== undefined) {
    if (value >= threshold * 1.2) {
      status = "critical";
    } else if (value >= threshold) {
      status = "warning";
    }
  }

  const metricCard = await MetricCard.create({
    title,
    dataSource,
    value,
    unit,
    threshold,
    status,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, metricCard, "Metric Card created successfully"));
});

const getAllMetricCards = asyncHandler(async (req, res) => {
  const metricCards = await MetricCard.find({ owner: req.user._id })
    .populate("dataSource", "name type endpoint")
    .lean();
  res
    .status(200)
    .json(
      new ApiResponse(200, metricCards, "Metric Cards retrieved successfully")
    );
});

const getMetricCardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const metricCard = await MetricCard.findOne({
    _id: id,
    owner: req.user._id,
  })
    .populate("dataSource", "name type endpoint")
    .lean();

  if (!metricCard) {
    throw new ApiError(404, "Metric Card not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, metricCard, "Metric Card retrieved successfully")
    );
});

const updateMetricCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { value, threshold, unit } = req.body;

  const metricCard = await MetricCard.findOne({
    _id: id,
    owner: req.user._id,
  });

  if (!metricCard) {
    throw new ApiError(404, "Metric card not Found");
  }

  // Validate numeric inputs
  if (value !== undefined && typeof value !== "number") {
    throw new ApiError(400, "Value must be a number");
  }
  if (threshold !== undefined && typeof threshold !== "number") {
    throw new ApiError(400, "Threshold must be a number");
  }

  // Update fields
  if (value !== undefined) {
    metricCard.value = value;
  }
  if (threshold !== undefined) {
    metricCard.threshold = threshold;
  }
  if (unit !== undefined) metricCard.unit = unit;

  // Recalculate status if value or threshold changed
  if (value !== undefined || threshold !== undefined) {
    const currentValue = metricCard.value;
    const currentThreshold = metricCard.threshold;

    if (currentValue >= currentThreshold * 1.2) {
      metricCard.status = "critical";
    } else if (currentValue >= currentThreshold) {
      metricCard.status = "warning";
    } else {
      metricCard.status = "normal";
    }
  }

  metricCard.lastUpdatedAt = Date.now();

  await metricCard.save();
  res
    .status(200)
    .json(new ApiResponse(200, metricCard, "Metric Card updated successfully"));
});

const deleteMetricCard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const metricCard = await MetricCard.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  if (!metricCard) {
    throw new ApiError(404, "Metric Card not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Metric Card deleted successfully"));
});

export {
  createMetricCard,
  getAllMetricCards,
  getMetricCardById,
  updateMetricCard,
  deleteMetricCard,
};
