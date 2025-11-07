import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { handleControllerError } from '../utils/apiResponse';

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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'FoodController',
      operation: 'getAllFoods',
      errorTitle: 'Помилка отримання продуктів',
      userMessage: 'Не вдалося завантажити список продуктів.',
      details: { query: req.query },
    });
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'FoodController',
      operation: 'getFoodById',
      errorTitle: 'Помилка отримання продукту',
      userMessage: 'Не вдалося завантажити дані продукту.',
      details: { params: req.params },
    });
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'FoodController',
      operation: 'createFood',
      errorTitle: 'Помилка створення продукту',
      userMessage: 'Не вдалося створити продукт.',
    });
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'FoodController',
      operation: 'updateFood',
      errorTitle: 'Помилка оновлення продукту',
      userMessage: 'Не вдалося оновити дані продукту.',
      details: { params: req.params },
    });
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'FoodController',
      operation: 'deleteFood',
      errorTitle: 'Помилка видалення продукту',
      userMessage: 'Не вдалося видалити продукт.',
      details: { params: req.params },
    });
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'FoodController',
      operation: 'getFoodOptions',
      errorTitle: 'Помилка отримання параметрів продуктів',
      userMessage: 'Не вдалося завантажити параметри фільтрації.',
    });
  }
};

