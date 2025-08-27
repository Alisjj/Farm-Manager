/**
 * Base class for custom exceptions.
 */
export class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Exception for bad requests (400).
 */
export class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/**
 * Exception for unauthorized access (401).
 */
export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * Exception for forbidden access (403).
 */
export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/**
 * Exception for not found errors (404).
 */
export class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/**
 * Exception for internal server errors (500).
 */
export class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}
