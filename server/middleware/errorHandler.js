// Centralized error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Database errors
  if (err.code === "SQLITE_CONSTRAINT") {
    status = 400;
    message = "Database constraint violation";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  }

  // Validation errors
  if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
