import { Router } from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginLimiter, authLimiter } from '../../middlewares/Ratelimiter.middleware .js';
import { loginSchema, changePasswordSchema } from './auth.validators.js';

const router = Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.post('/login', loginLimiter, validate(loginSchema), authController.loginController);
router.post('/refresh', authLimiter, authController.refreshController);
router.post('/logout', authController.logoutController);

// ─── Authenticated routes ─────────────────────────────────────────────────────
router.get('/me', protect, authController.meController);
router.get('/sessions', protect, authController.getSessionsController);
router.post('/logout-all', protect, authController.logoutAllController);
router.post(
  '/change-password',
  protect,
  validate(changePasswordSchema),
  authController.changePasswordController,
);

export default router;
