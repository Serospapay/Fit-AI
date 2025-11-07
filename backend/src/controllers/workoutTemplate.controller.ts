import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { handleControllerError } from '../utils/apiResponse';

// Створити шаблон тренування
export const createWorkoutTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, description, type, exercises } = req.body;

    const template = await prisma.workoutTemplate.create({
      data: {
        userId,
        name,
        description: description || null,
        type: type || null,
        exercises: exercises || [],
      },
    });

    logger.info('Workout template created successfully', { templateId: template.id });
    res.status(201).json(template);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutTemplateController',
      operation: 'createWorkoutTemplate',
      errorTitle: 'Помилка створення шаблону тренування',
      userMessage: 'Не вдалося створити шаблон тренування.',
    });
  }
};

// Отримати всі шаблони користувача
export const getUserTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const templates = await prisma.workoutTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ templates });
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutTemplateController',
      operation: 'getUserTemplates',
      errorTitle: 'Помилка отримання шаблонів',
      userMessage: 'Не вдалося завантажити шаблони тренувань.',
    });
  }
};

// Оновити шаблон
export const updateWorkoutTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { name, description, type, exercises } = req.body;

    const existingTemplate = await prisma.workoutTemplate.findFirst({
      where: { id, userId },
    });

    if (!existingTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (exercises !== undefined) updateData.exercises = exercises;

    const template = await prisma.workoutTemplate.update({
      where: { id },
      data: updateData,
    });

    logger.info('Template updated successfully', { templateId: id });
    res.json(template);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutTemplateController',
      operation: 'updateWorkoutTemplate',
      errorTitle: 'Помилка оновлення шаблону',
      userMessage: 'Не вдалося оновити шаблон тренування.',
      details: { params: req.params },
    });
  }
};

// Видалити шаблон
export const deleteWorkoutTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const template = await prisma.workoutTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await prisma.workoutTemplate.delete({
      where: { id },
    });

    logger.info('Template deleted successfully', { templateId: id });
    res.status(204).send();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutTemplateController',
      operation: 'deleteWorkoutTemplate',
      errorTitle: 'Помилка видалення шаблону',
      userMessage: 'Не вдалося видалити шаблон тренування.',
      details: { params: req.params },
    });
  }
};

