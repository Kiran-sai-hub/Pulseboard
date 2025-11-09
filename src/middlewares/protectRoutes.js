import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ENV_VARS from "../config/envVars.js";
import { ApiError } from "../utils/ApiError.js";

const protectRoutes = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Not authorized, token missing");
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Not authorized, invalid token"));
    }
    next(error);
  }
});

export default protectRoutes;
