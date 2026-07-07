// modules/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../modules/auth/auth.jwt.js';
import { AppError, ErrorCode } from '../errors/AppError.js';

import type { UserRole } from '../modules/auth/auth.model.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
    sessionId?: string;
  };
}

// ─── protect ────────────────────────────────────────────────────────────────

export const protect = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies?.accessToken as string | undefined;
    
    // If no token in cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      console.log('❌ No token found in cookie or Authorization header');
      return next(new AppError('Authentication required', 401, ErrorCode.TOKEN_INVALID));
    }

    console.log('🔑 Token found, verifying...');

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    console.log('✅ User authenticated:', decoded.userId);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log('❌ Token expired');
      return next(
        new AppError('Session expired, please log in again', 401, ErrorCode.TOKEN_EXPIRED),
      );
    }
    if (err instanceof jwt.JsonWebTokenError) {
      console.log('❌ Invalid token:', err.message);
      return next(new AppError('Invalid token', 401, ErrorCode.TOKEN_INVALID));
    }
    console.log('❌ Authentication failed:', err);
    next(new AppError('Authentication failed', 401, ErrorCode.TOKEN_INVALID));
  }
};

// ─── authorize ──────────────────────────────────────────────────────────────

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, ErrorCode.FORBIDDEN));
    }
    next();
  };
};