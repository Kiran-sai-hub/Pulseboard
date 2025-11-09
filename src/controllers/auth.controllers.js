import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ENV_VARS from "../config/envVars.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateToken = (userId) => {
  const token = jwt.sign({ _id: userId }, ENV_VARS.JWT_SECRET, {
    expiresIn: ENV_VARS.JWT_EXPIRES_IN,
  });
  return token;
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const newUser = await User.create({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password,
  });

  const createdUser = await User.findById(newUser._id)
    .select("-password")
    .lean();
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registration");
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password").lean();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("jwt", token, options)
    .json(
      new ApiResponse(200, { user: loggedInUser, token }, "Login successful")
    );
});

const authCheck = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, "Not authenticated"));
  }

  res.status(200).json(new ApiResponse(200, user, "Authenticated"));
});

const logout = asyncHandler(async (req, res, next) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("jwt", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { registerUser, loginUser, authCheck, logout };
