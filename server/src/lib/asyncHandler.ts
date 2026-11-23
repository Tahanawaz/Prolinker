import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wrap async handlers so rejected promises reach the error middleware
 * (Express 4 does not do this natively).
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
