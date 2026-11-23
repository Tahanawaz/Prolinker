import { ERROR_CODES, type ApiFailure } from '@prolinker/shared';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { isProduction } from '../config/env';
import { AppError } from '../lib/AppError';
import { logger } from '../lib/logger';
import { requestIdOf } from '../lib/requestId';

interface BodyParserError {
  type: string;
  status?: number;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    typeof error === 'object' && error !== null && 'type' in error && typeof error.type === 'string'
  );
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of error.issues) {
      (details[issue.path.join('.') || '_'] ??= []).push(issue.message);
    }
    return AppError.validation(details);
  }

  if (isBodyParserError(error)) {
    if (error.type === 'entity.parse.failed') return AppError.badRequest('Malformed JSON body');
    if (error.type === 'entity.too.large') {
      return new AppError(413, ERROR_CODES.PAYLOAD_TOO_LARGE, 'Request body is too large');
    }
    if (error.status && error.status < 500) return AppError.badRequest('Invalid request body');
  }

  return AppError.internal('Something went wrong', error);
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, ERROR_CODES.NOT_FOUND, `Route ${req.method} ${req.path} not found`));
};

/** Central error handler: every failure leaves as `{ success: false, data: null, error }`. */
export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const appError = normalizeError(error);
  const requestId = requestIdOf(req);

  if (appError.statusCode >= 500) {
    logger.error({ err: error, requestId, path: req.path }, appError.message);
  } else {
    logger.debug({ code: appError.code, requestId, path: req.path }, appError.message);
  }

  // Never leak internal messages for unexpected errors in production.
  const message =
    appError.isOperational || !isProduction ? appError.message : 'Something went wrong';

  const body: ApiFailure = {
    success: false,
    data: null,
    error: {
      code: appError.code,
      message,
      ...(requestId ? { requestId } : {}),
      ...(appError.details ? { details: appError.details } : {}),
    },
  };

  res.status(appError.statusCode).json(body);
};
