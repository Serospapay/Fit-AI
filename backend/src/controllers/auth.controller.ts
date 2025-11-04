import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import logger from '../lib/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Перевірка чи користувач вже існує
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Хешування пароля
    const passwordHash = await hashPassword(password);

    // Створення користувача
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Генерація токену
    const token = generateToken(user.id);

    res.status(201).json({
      user,
      token,
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Пошук користувача
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Перевірка пароля
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Генерація токену
    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        activityLevel: true,
        goal: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { name, age, gender, height, weight, activityLevel, goal } = req.body;

    // Валідація даних
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name || null;
    }

    if (age !== undefined) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
        return res.status(400).json({ error: 'Вік повинен бути від 1 до 150 років' });
      }
      updateData.age = ageNum;
    }

    if (gender !== undefined) {
      const validGenders = ['male', 'female', 'other'];
      if (gender && !validGenders.includes(gender)) {
        return res.status(400).json({ error: 'Стать повинна бути: male, female або other' });
      }
      updateData.gender = gender || null;
    }

    if (height !== undefined) {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
        return res.status(400).json({ error: 'Зріст повинен бути від 50 до 300 см' });
      }
      updateData.height = heightNum;
    }

    if (weight !== undefined) {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum < 1 || weightNum > 500) {
        return res.status(400).json({ error: 'Вага повинна бути від 1 до 500 кг' });
      }
      updateData.weight = weightNum;
    }

    if (activityLevel !== undefined) {
      const validLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
      if (activityLevel && !validLevels.includes(activityLevel)) {
        return res.status(400).json({ error: 'Невірний рівень активності' });
      }
      updateData.activityLevel = activityLevel || null;
    }

    if (goal !== undefined) {
      const validGoals = ['lose_weight', 'gain_muscle', 'maintain', 'endurance', 'definition'];
      if (goal && !validGoals.includes(goal)) {
        return res.status(400).json({ error: 'Невірна мета' });
      }
      updateData.goal = goal || null;
    }

    // Оновлення профілю
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        activityLevel: true,
        goal: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info('Profile updated successfully', { userId });
    res.json(updatedUser);
  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

