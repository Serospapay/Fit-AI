import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { handleControllerError, sendError } from '../utils/apiResponse';
import { createGoalSchema, goalQuerySchema, updateGoalSchema } from '../validation/goal.schema';

// Створити ціль
export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const parsed = createGoalSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        error: 'Помилка валідації',
        message: 'Перевірте введені дані цілі.',
        details: parsed.error.flatten(),
      });
    }

    const { title, description, category, targetValue, unit, targetDate } = parsed.data;

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description: description ?? null,
        category,
        targetValue: targetValue ?? null,
        unit: unit ?? null,
        targetDate: targetDate ?? null,
        currentValue: 0,
      },
    });

    logger.info('Goal created successfully', { goalId: goal.id });
    res.status(201).json(goal);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'GoalController',
      operation: 'createGoal',
      errorTitle: 'Помилка створення цілі',
      userMessage: 'Не вдалося створити нову ціль.',
    });
  }
};

// Отримати всі цілі користувача
export const getUserGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const parsedQuery = goalQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return sendError(res, {
        statusCode: 400,
        error: 'Помилка валідації',
        message: 'Невірні параметри фільтрації цілей.',
        details: parsedQuery.error.flatten(),
      });
    }

    const { status } = parsedQuery.data;

    const where: Record<string, unknown> = { userId };
    if (status) {
      where.status = status;
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ goals });
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'GoalController',
      operation: 'getUserGoals',
      errorTitle: 'Помилка отримання цілей',
      userMessage: 'Не вдалося завантажити список цілей.',
    });
  }
};

// Оновити ціль
export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const parsed = updateGoalSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        error: 'Помилка валідації',
        message: 'Перевірте дані для оновлення цілі.',
        details: parsed.error.flatten(),
      });
    }

    // Перевірка що ціль належить користувачу
    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const { title, description, targetValue, currentValue, unit, targetDate, status, category } =
      parsed.data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description ?? null;
    if (category !== undefined) updateData.category = category;
    if (targetValue !== undefined) updateData.targetValue = targetValue ?? null;
    if (currentValue !== undefined) updateData.currentValue = currentValue ?? null;
    if (unit !== undefined) updateData.unit = unit ?? null;
    if (targetDate !== undefined) updateData.targetDate = targetDate ?? null;
    if (status !== undefined) updateData.status = status;

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    logger.info('Goal updated successfully', { goalId: id });
    res.json(goal);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'GoalController',
      operation: 'updateGoal',
      errorTitle: 'Помилка оновлення цілі',
      userMessage: 'Не вдалося оновити ціль.',
      details: { params: req.params },
    });
  }
};

// Видалити ціль
export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const goal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.goal.delete({
      where: { id },
    });

    logger.info('Goal deleted successfully', { goalId: id });
    res.status(204).send();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'GoalController',
      operation: 'deleteGoal',
      errorTitle: 'Помилка видалення цілі',
      userMessage: 'Не вдалося видалити ціль.',
      details: { params: req.params },
    });
  }
};

