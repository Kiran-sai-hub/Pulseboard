import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Handles custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }
  // Handles unexpected errors
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
