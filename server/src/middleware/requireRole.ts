import type { UserRole } from '@prolinker/shared';
import type { Request, RequestHandler } from 'express';

import { AppError } from '../lib/AppError';
import type { AuthContext } from '../types/express';

/** Allow the request only if the authenticated user has one of `roles`. Use after `authenticate`. */
export function requireRole(...roles: readonly [UserRole, ...UserRole[]]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) {
      next(AppError.unauthorized());
      return;
    }
    if (!roles.includes(req.auth.role)) {
      next(AppError.forbidden());
      return;
    }
    next();
  };
}

/** Typed accessor for controllers on authenticated routes. */
export function getAuth(req: Request): AuthContext {
  if (!req.auth) throw AppError.unauthorized();
  return req.auth;
}
