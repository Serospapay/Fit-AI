/**
 * Конфігурація та валідація змінних середовища
 */
import dotenv from 'dotenv';
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const isTest = nodeEnv === 'test';
const requiredEnvVars = isTest ? [] : (['DATABASE_URL'] as const);
for (const key of requiredEnvVars) {
  const val = process.env[key];
  if (!val?.trim()) {
    throw new Error(`Missing required env: ${key}`);
  }
}

if (isProduction) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16 || secret === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET is required in production (min 16 chars). Set it in .env');
  }
}

export const config = {
  NODE_ENV: nodeEnv,
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? '' : 'dev-secret-only-for-local'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  SKIP_DB_CONNECT: process.env.SKIP_DB_CONNECT,
};

// Для seed - ID дефолтного користувача (створюється при seed)
export const DEFAULT_USER_ID = 'default-user-123';
