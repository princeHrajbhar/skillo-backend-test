// app.js
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import programRoutes from './modules/programs/program.routes.js';
import uploadRoutes from './modules/test/upload.routes.js';
import fileRoutes from './modules/file-upload/file.routes.js';
import blogRoutes from './modules/blog/blog.route.js';
import { globalErrorHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './modules/auth/auth.route.js';
import blogcategoryRoutes from "./modules/blogCategory/blogCategory.route.js";
import coursecategoryRoutes from "./modules/courseCategory/courseCategory.routes.js";
import userRoutes from './modules/user/user.route.js';
import courseRoutes from './modules/course/course.routes.js';

const app: Application = express();

// Trust the reverse proxy (Render/Vercel) so secure cookies and req.ip work.
app.set('trust proxy', 1);

// ─── CORS Configuration ──────────────────────────────────────────────────────
// Comma-separated list of allowed origins, e.g.
// FRONTEND_URL=https://your-app.vercel.app,http://localhost:3000
const normalizeOrigin = (o: string) => o.trim().replace(/\/+$/, ''); // drop trailing slash

// Allowed CORS origins are defined here in code (local dev on :3000 or :3001).
// Any additional production origins can still be appended via FRONTEND_URL
// (comma-separated) if the env var is set, but it is optional.
const DEV_ORIGINS = ['http://localhost:3000', 'http://localhost:3001', 'https://skillo-frontend.vercel.app'];

const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...DEV_ORIGINS.map(normalizeOrigin), ...envOrigins]),
);

console.log('🌐 CORS allowed origins:', allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
  // Allow requests with no Origin (Postman, curl, health checks)
  if (!origin) {
    return callback(null, true);
  }

  const normalized = normalizeOrigin(origin);

  // Allow explicitly configured origins
  if (allowedOrigins.includes(normalized)) {
    return callback(null, true);
  }

  // Allow ALL Vercel deployments
  if (normalized.endsWith(".vercel.app")) {
    return callback(null, true);
  }

  console.warn(`⛔ CORS blocked origin: ${origin}`);
  return callback(new Error("Not allowed by CORS"));
},
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  }),
);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api', uploadRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/blogcategory', blogcategoryRoutes);
app.use('/api/v1/coursecategory', coursecategoryRoutes);
app.use('/api/v1/users', userRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Skillo Backend is operational',
  });
});

// Conventional health endpoint for load balancers / uptime monitors.
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'skillo-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;
