/**
 * @file: app.ts
 * @description: Конфігурація Express-додатку без запуску HTTP-сервера
 * @dependencies: express, cors, dotenv, routes, middleware, swagger
 * @created: 2025-11-07
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import exerciseRoutes from './routes/exercise.routes';
import workoutRoutes from './routes/workout.routes';
import nutritionRoutes from './routes/nutrition.routes';
import foodRoutes from './routes/food.routes';
import quoteRoutes from './routes/quote.routes';
import goalRoutes from './routes/goal.routes';
import workoutTemplateRoutes from './routes/workoutTemplate.routes';
import reminderRoutes from './routes/reminder.routes';
import recommendationRoutes from './routes/recommendation.routes';
import exportRoutes from './routes/export.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSwagger } from './lib/swagger';
import logger from './lib/logger';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fitness Trainer API is running',
    timestamp: new Date().toISOString(),
  });
});

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/workout-templates', workoutTemplateRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/export', exportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;


