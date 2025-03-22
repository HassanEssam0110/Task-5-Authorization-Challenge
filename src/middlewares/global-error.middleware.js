import config from "../../config/config.js";
import { AppError } from "../utils/api-error-calss.utils.js";

/**
 * Middleware function to handle requests for routes that are not found.
 *
 * This function creates a new AppError with a 404 status code and a message
 * indicating the original URL requested, then passes the error to the next
 * middleware in the stack.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */

const NotFoundHandler = (req, res, next) => {
  next(
    new AppError(404, `This Route Not Found, ${req.method} ${req.originalUrl}`)
  );
};


const sendErrorToProduction = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || undefined,
    });
  }

  // Programming or other unknown error: don't leak error details
  return res.status(500).json({
    message: "Something went wrong",
    status: "error",
    statusCode: 500,
  });
};

const sendErrorToDevelopment = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    errors: err.errors || undefined,
    isOperational: err.isOperational,
    stack: err.stack, // Show stack only in dev mode
  });
};

/**
 * Global Error Handler
 * This function is the last middleware in the stack and will catch any
 * errors that are thrown or passed to next() by other middleware.
 * It will then either send a friendly error message to the user in production
 * or the full error stack in development mode.
 *
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function.
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (config.NODE_ENV === "production") {
    sendErrorToProduction(err, res);
  } else {
    sendErrorToDevelopment(err, res);
  }
};

export { globalErrorHandler, NotFoundHandler };
