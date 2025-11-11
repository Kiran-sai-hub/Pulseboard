import asyncHandler from "../utils/asyncHandler.js";
import DataSource from "../models/dataSource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllDataSources = asyncHandler(async (req, res, next) => {
  const dataSources = await DataSource.find({ owner: req.user._id }).lean();
  res
    .status(200)
    .json(
      new ApiResponse(200, dataSources, "Data Sources fetched successfully")
    );
});

const createDataSource = asyncHandler(async (req, res, next) => {
  const { name, type, description, endpoint, updateFrequency, mockData } = req.body;
  if (!name || !type || !endpoint) {
    throw new ApiError(400, "Name, Type and Endpoint are required");
  }

  const existingDataSource = await DataSource.findOne({
    name: name.trim(),
    owner: req.user._id,
  });
  if (existingDataSource) {
    throw new ApiError(409, "Data Source with the same name already exists");
  }
  const ownerId = req.user._id;

  const newDataSource = await DataSource.create({
    name: name.trim(),
    type: type.trim(),
    description: description ? description.trim() : "",
    endpoint: endpoint,
    updateFrequency: updateFrequency || 15,
    owner: ownerId,
    mockData,
  });

  const plainDataSource = newDataSource.toObject();

  res
    .status(201)
    .json(
      new ApiResponse(201, plainDataSource, "Data Source created successfully")
    );
});

const getDataSourceById = asyncHandler(async (req, res, next) => {
  const dataSourceId = req.params.id;

  const dataSource = await DataSource.findOne({
    _id: dataSourceId,
    owner: req.user._id,
  }).lean();
  if (!dataSource) {
    throw new ApiError(404, "Data Source not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, dataSource, "Data Source fetched successfully"));
});

const updateDataSource = asyncHandler(async (req, res, next) => {
    const dataSourceId = req.params.id;
    const { description, updateFrequency, isActive, mockData } = req.body;

    const dataSource = await DataSource.findOne({ owner: req.user._id, _id: dataSourceId });
    if (!dataSource) {
      throw new ApiError(404, "Data Source not found");
    };

    if (description !== undefined && typeof description === "string") dataSource.description = description.trim();
    if (updateFrequency !== undefined) dataSource.updateFrequency = updateFrequency;
    if (isActive !== undefined) dataSource.isActive = isActive;
    if (mockData !== undefined) dataSource.mockData = mockData;

    const updatedDataSource = await dataSource.save();

    res
      .status(200)
      .json(new ApiResponse(200, updatedDataSource.toObject(), "Data Source updated successfully"));
});

const deleteDataSource = asyncHandler(async (req, res, next) => {
  const dataSourceId = req.params.id;
  
  const dataSource = await DataSource.findOneAndDelete({
    _id: dataSourceId,
    owner: req.user._id,
  });
  if (!dataSource) {
    throw new ApiError(404, "Data Source not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Data Source deleted successfully"));
});

export {
  getAllDataSources,
  createDataSource,
  getDataSourceById,
  updateDataSource,
  deleteDataSource,
};
