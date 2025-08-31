/**
 * Global error handling middleware for Express.
 */
export default function errorHandler(err, req, res, next) {
  // Only log errors in non-test environments
  if (process.env.NODE_ENV !== "test") {
    console.error(err.stack); // Log the error stack for debugging
  }

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
}
