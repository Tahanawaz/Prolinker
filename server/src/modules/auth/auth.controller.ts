import { updateProfileSchema } from '@prolinker/shared';

import { sendSuccess } from '../../lib/apiResponse';
import { handler } from '../../lib/handler';
import { getAuth } from '../../middleware/requireRole';
import { authService } from './auth.service';

export const authController = {
  getMe: handler({}, async ({ req, res }) => {
    const user = await authService.getCurrentUser(getAuth(req));
    sendSuccess(res, user);
  }),

  updateMe: handler({ body: updateProfileSchema }, async ({ req, res, body }) => {
    const user = await authService.updateCurrentUser(getAuth(req), body);
    sendSuccess(res, user);
  }),
};
