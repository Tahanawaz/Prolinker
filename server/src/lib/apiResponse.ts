import type { ApiSuccess } from '@prolinker/shared';
import type { Response } from 'express';

export function sendSuccess(res: Response, data: unknown, statusCode = 200): void {
  const body: ApiSuccess<unknown> = { success: true, data, error: null };
  res.status(statusCode).json(body);
}
