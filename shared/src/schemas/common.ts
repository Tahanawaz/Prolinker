import { z } from 'zod';

export const uuidSchema = z.uuid();

/** Pakistani mobile in E.164-ish form: +923001234567 or 03001234567. */
export const pkPhoneSchema = z
  .string()
  .trim()
  .regex(/^(\+92|0)3\d{9}$/, 'Enter a valid Pakistani mobile number (e.g. 03001234567)')
  .transform((value) => (value.startsWith('0') ? `+92${value.slice(1)}` : value));

/** CNIC in the standard 12345-1234567-1 format. */
export const cnicSchema = z
  .string()
  .trim()
  .regex(/^\d{5}-\d{7}-\d$/, 'CNIC must look like 12345-1234567-1');

export const citySchema = z.string().trim().min(2).max(80);

export const personNameSchema = z
  .string()
  .trim()
  .min(2, 'Name is too short')
  .max(120, 'Name is too long');

/** Money in PKR, up to 2 decimals, positive. */
export const amountSchema = z
  .number()
  .positive()
  .max(10_000_000)
  .multipleOf(0.01, 'At most 2 decimal places');

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
