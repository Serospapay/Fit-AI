import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

// Отримати всі продукти
export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '100' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { nameUk: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    const [foods, total] = await Promise.all([
      prisma.food.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: 'asc' }
      }),
      prisma.food.count({ where })
    ]);

    res.json({
      foods,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    logger.error('Get foods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати продукт по ID
export const getFoodById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const food = await prisma.food.findUnique({
      where: { id }
    });

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.json(food);
  } catch (error: any) {
    logger.error('Get food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Створити продукт
export const createFood = async (req: Request, res: Response) => {
  try {
    const foodData = req.body;

    const food = await prisma.food.create({
      data: foodData
    });

    res.status(201).json(food);
  } catch (error: any) {
    logger.error('Create food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Оновити продукт
export const updateFood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foodData = req.body;

    const food = await prisma.food.update({
      where: { id },
      data: foodData
    });

    res.json(food);
  } catch (error: any) {
    logger.error('Update food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Видалити продукт
export const deleteFood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.food.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error: any) {
    logger.error('Delete food error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати опції фільтрації
export const getFoodOptions = async (req: Request, res: Response) => {
  try {
    const totalCount = await prisma.food.count();
    const categories = await prisma.food.findMany({
      select: { category: true },
      distinct: ['category']
    });

    res.json({
      totalFoods: totalCount,
      categories: categories.map(c => c.category).filter(Boolean)
    });
  } catch (error: any) {
    logger.error('Get food options error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

