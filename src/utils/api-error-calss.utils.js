export class AppError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = this.getStatusValue(statusCode);
    this.errors = errors; // Store validation errors
    this.isOperational = true;

    Error.captureStackTrace(this, this.stack);
  }

  getStatusValue(statusCode) {
    const statusMap = {
      400: "bad_request",
      401: "unauthorized",
      403: "forbidden",
      404: "not_found",
      409: "conflict",
      422: "unprocessable_entity",
      500: "error",
      501: "not_implemented",
      502: "bad_gateway",
      503: "service_unavailable",
      504: "gateway_timeout",
    };
    return (
      statusMap[statusCode] ||
      (statusCode >= 400 && statusCode < 500 ? "fail" : "error")
    );
  }
}
