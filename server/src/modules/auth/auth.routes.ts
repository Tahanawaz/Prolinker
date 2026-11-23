import { Router } from 'express';

import { authenticate } from '../../middleware/authenticate';
import { authController } from './auth.controller';

/**
 * Sign-up / sign-in / OTP happen directly between the browser and Supabase
 * Auth. The API only exposes the current user's profile.
 */
export const authRouter = Router();

authRouter.use(authenticate);
authRouter.get('/me', authController.getMe);
authRouter.patch('/me', authController.updateMe);
