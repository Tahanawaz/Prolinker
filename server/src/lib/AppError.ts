import { ERROR_CODES, type ErrorCode } from '@prolinker/shared';

type Details = Record<string, string[]>;

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: Details | undefined;
  /** Operational errors are expected (bad input, auth); others are bugs. */
  readonly isOperational: boolean;

  constructor(
    statusCode: number,
    code: ErrorCode | (string & Record<never, never>),
    message: string,
    options: { details?: Details; cause?: unknown; isOperational?: boolean } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = options.details;
    this.isOperational = options.isOperational ?? true;
  }

  static badRequest(message = 'Bad request', details?: Details): AppError {
    return new AppError(400, ERROR_CODES.BAD_REQUEST, message, details ? { details } : {});
  }

  static validation(details: Details): AppError {
    return new AppError(422, ERROR_CODES.VALIDATION_ERROR, 'Validation failed', { details });
  }

  static unauthorized(message = 'Authentication required'): AppError {
    return new AppError(401, ERROR_CODES.UNAUTHORIZED, message);
  }

  static forbidden(message = 'You do not have permission to perform this action'): AppError {
    return new AppError(403, ERROR_CODES.FORBIDDEN, message);
  }

  static notFound(resource = 'Resource'): AppError {
    return new AppError(404, ERROR_CODES.NOT_FOUND, `${resource} not found`);
  }

  static conflict(message: string): AppError {
    return new AppError(409, ERROR_CODES.CONFLICT, message);
  }

  static notImplemented(feature: string): AppError {
    return new AppError(501, ERROR_CODES.NOT_IMPLEMENTED, `${feature} is not available yet`);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable'): AppError {
    return new AppError(503, ERROR_CODES.SERVICE_UNAVAILABLE, message);
  }

  static internal(message = 'Something went wrong', cause?: unknown): AppError {
    return new AppError(500, ERROR_CODES.INTERNAL_ERROR, message, { cause, isOperational: false });
  }
}
