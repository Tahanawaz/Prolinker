import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { z, ZodType } from 'zod';

import { AppError } from './AppError';

type AnySchema = ZodType;

interface RequestSchemas<B extends AnySchema, Q extends AnySchema, P extends AnySchema> {
  body?: B;
  query?: Q;
  params?: P;
}

export interface HandlerContext<B, Q, P> {
  body: B;
  query: Q;
  params: P;
  req: Request;
  res: Response;
  next: NextFunction;
}

/** Collect Zod issues as `{ "body.email": ["Invalid email"] }`. */
function collectIssues(
  part: string,
  error: z.ZodError,
  into: Record<string, string[]>,
): Record<string, string[]> {
  for (const issue of error.issues) {
    const key = [part, ...issue.path].join('.');
    (into[key] ??= []).push(issue.message);
  }
  return into;
}

/**
 * Typed, validated, async-safe route handler.
 * Every declared part (body/query/params) is parsed with Zod before the
 * controller runs; unknown parts stay `unknown`, so nothing unvalidated
 * reaches business logic. Errors are forwarded to the central error handler.
 */
export function handler<
  B extends AnySchema = ZodType,
  Q extends AnySchema = ZodType,
  P extends AnySchema = ZodType,
>(
  schemas: RequestSchemas<B, Q, P>,
  fn: (ctx: HandlerContext<z.infer<B>, z.infer<Q>, z.infer<P>>) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    const details: Record<string, string[]> = {};
    const parse = (part: 'body' | 'query' | 'params', schema: AnySchema | undefined): unknown => {
      const raw: unknown = req[part];
      if (!schema) return raw;
      const result = schema.safeParse(raw);
      if (!result.success) {
        collectIssues(part, result.error, details);
        return undefined;
      }
      return result.data;
    };

    const params = parse('params', schemas.params);
    const query = parse('query', schemas.query);
    const body = parse('body', schemas.body);

    if (Object.keys(details).length > 0) {
      next(AppError.validation(details));
      return;
    }

    fn({
      body: body as z.infer<B>,
      query: query as z.infer<Q>,
      params: params as z.infer<P>,
      req,
      res,
      next,
    }).catch(next);
  };
}
