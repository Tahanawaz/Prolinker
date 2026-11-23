import type { Request } from 'express';

/** The request id assigned by pino-http, as a string (for API error bodies). */
export function requestIdOf(req: Request): string | undefined {
  const id: unknown = req.id;
  return typeof id === 'string' || typeof id === 'number' ? String(id) : undefined;
}
