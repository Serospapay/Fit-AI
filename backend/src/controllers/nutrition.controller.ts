import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

// Створити новий запис харчування
export const createNutritionLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { date, mealType, items } = req.body;

    // Combine date and time if provided
    let logDate = new Date();
    if (date) {
      logDate = new Date(date);
    }

    // Calculate totals from items
    const totals = items?.reduce((acc: any, item: any) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const nutritionLog = await prisma.nutritionLog.create({
      data: {
        userId,
        date: logDate,
        mealType,
        items: {
          create: items?.map((item: any) => ({
            name: item.name,
            nameUk: item.nameUk || null,
            amount: item.amount,
            calories: item.calories,
            protein: item.protein || 0,
            carbs: item.carbs || 0,
            fat: item.fat || 0,
            fiber: item.fiber || null
          })) || []
        }
      },
      include: {
        items: true
      }
    });

    logger.info('Nutrition log created successfully', { nutritionLogId: nutritionLog.id });
    res.status(201).json({ ...nutritionLog, totals });
  } catch (error: any) {
    logger.error('Create nutrition log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати всі записи харчування користувача
export const getUserNutritionLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, mealType, limit = '100', offset = '0' } = req.query;

    const where: any = { userId };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (mealType) {
      where.mealType = mealType;
    }

    const [logs, total] = await Promise.all([
      prisma.nutritionLog.findMany({
        where,
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: { date: 'desc' },
        include: {
          items: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.nutritionLog.count({ where })
    ]);

    // Calculate totals for each log
    const logsWithTotals = logs.map(log => {
      const totals = log.items.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      return { ...log, totals };
    });

    res.json({ logs: logsWithTotals, total });
  } catch (error: any) {
    logger.error('Get nutrition logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати статистику харчування
export const getNutritionStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { days = '30' } = req.query;

    const daysNum = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Get all nutrition logs
    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: { gte: startDate }
      },
      include: {
        items: true
      }
    });

    // Calculate overall stats
    const totals = logs.reduce((acc, log) => {
      const logTotals = log.items.reduce((itemAcc, item) => ({
        calories: itemAcc.calories + item.calories,
        protein: itemAcc.protein + item.protein,
        carbs: itemAcc.carbs + item.carbs,
        fat: itemAcc.fat + item.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      return {
        calories: acc.calories + logTotals.calories,
        protein: acc.protein + logTotals.protein,
        carbs: acc.carbs + logTotals.carbs,
        fat: acc.fat + logTotals.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const avgPerDay = logs.length > 0 ? {
      calories: totals.calories / logs.length,
      protein: totals.protein / logs.length,
      carbs: totals.carbs / logs.length,
      fat: totals.fat / logs.length
    } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Meal type distribution
    const mealTypeStats = logs.reduce((acc: any, log) => {
      acc[log.mealType] = (acc[log.mealType] || 0) + 1;
      return acc;
    }, {});

    // Daily breakdown for last 7 days
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });

      const dayTotals = dayLogs.reduce((acc, log) => {
        const logTotals = log.items.reduce((itemAcc, item) => ({
          calories: itemAcc.calories + item.calories,
          protein: itemAcc.protein + item.protein,
          carbs: itemAcc.carbs + item.carbs,
          fat: itemAcc.fat + item.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return {
          calories: acc.calories + logTotals.calories,
          protein: acc.protein + logTotals.protein,
          carbs: acc.carbs + logTotals.carbs,
          fat: acc.fat + logTotals.fat
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

      dailyBreakdown.push({
        date: date.toISOString().split('T')[0],
        ...dayTotals
      });
    }

    res.json({
      totalLogs: logs.length,
      totals,
      avgPerDay,
      mealTypeStats,
      dailyBreakdown
    });
  } catch (error: any) {
    logger.error('Get nutrition stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Видалити запис харчування
export const deleteNutritionLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const nutritionLog = await prisma.nutritionLog.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!nutritionLog) {
      return res.status(404).json({ error: 'Nutrition log not found' });
    }

    await prisma.nutritionLog.delete({
      where: { id }
    });

    logger.info('Nutrition log deleted successfully', { nutritionLogId: id });
    res.status(204).send();
  } catch (error: any) {
    logger.error('Delete nutrition log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
