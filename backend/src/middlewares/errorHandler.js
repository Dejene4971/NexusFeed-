const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors).map(({ message: detail }) => detail).join(", ");
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "A value must be unique";
  }

  if (statusCode >= 500) {
    console.error(error);
    message = "Internal server error";
  }

  res.status(statusCode).json({ success: false, message });
};

export { notFoundHandler, errorHandler };