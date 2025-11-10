import asyncHandler from "../utils/asyncHandler";
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
  const { name, type, description, endpoint, updateFrequency } = req.body;
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
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newDataSource, "Data Source created successfully")
    );
});

const getDataSourceById = asyncHandler(async (req, res, next) => {
    const dataSourceId = req.params.id;
});

const updateDataSource = asyncHandler();

const deleteDataSource = asyncHandler();

export {
  getAllDataSources,
  createDataSource,
  getDataSourceById,
  updateDataSource,
  deleteDataSource,
};
