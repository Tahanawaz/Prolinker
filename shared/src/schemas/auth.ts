import { z } from 'zod';

import { SIGNUP_ROLES } from '../enums';
import { citySchema, personNameSchema, pkPhoneSchema } from './common';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password is too long')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/\d/, 'Include a number');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email('Enter a valid email address'));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(72),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: personNameSchema,
    email: emailSchema,
    phone: pkPhoneSchema.optional(),
    city: citySchema,
    role: z.enum(SIGNUP_ROLES),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { error: 'You must accept the terms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
export type SignupInput = z.infer<typeof signupSchema>;

/** Fields a user may change on their own profile (role / is_active are server-only). */
export const updateProfileSchema = z
  .strictObject({
    fullName: personNameSchema,
    phone: pkPhoneSchema.nullable(),
    city: citySchema.nullable(),
    avatarUrl: z
      .url({ protocol: /^https$/ })
      .max(500)
      .nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to update' });
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
