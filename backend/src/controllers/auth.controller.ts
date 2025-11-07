import { Response, Request } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import logger from '../lib/logger';
import { AuthRequest, ProfileUpdate } from '../types';
import { handleControllerError } from '../utils/apiResponse';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Іван Іванов
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 token:
 *                   type: string
 *       400:
 *         description: Помилка валідації або користувач вже існує
 */
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'AuthController',
      operation: 'register',
      errorTitle: 'Помилка реєстрації',
      userMessage: 'Не вдалося зареєструвати користувача.',
    });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Успішний вхід
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       401:
 *         description: Невірний email або пароль
 */
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'AuthController',
      operation: 'login',
      errorTitle: 'Помилка авторизації',
      userMessage: 'Не вдалося ввійти до системи.',
    });
  }
};

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Отримати профіль користувача
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 age:
 *                   type: number
 *                 gender:
 *                   type: string
 *                   enum: [male, female, other]
 *                 height:
 *                   type: number
 *                 weight:
 *                   type: number
 *                 activityLevel:
 *                   type: string
 *                   enum: [sedentary, light, moderate, active, very_active]
 *                 goal:
 *                   type: string
 *                   enum: [lose_weight, gain_muscle, maintain, endurance, definition]
 *       404:
 *         description: Користувач не знайдений
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'AuthController',
      operation: 'getProfile',
      errorTitle: 'Помилка отримання профілю',
      userMessage: 'Не вдалося завантажити дані профілю.',
    });
  }
};

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Оновити профіль користувача
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 150
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               height:
 *                 type: number
 *                 minimum: 50
 *                 maximum: 300
 *               weight:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 500
 *               activityLevel:
 *                 type: string
 *                 enum: [sedentary, light, moderate, active, very_active]
 *               goal:
 *                 type: string
 *                 enum: [lose_weight, gain_muscle, maintain, endurance, definition]
 *     responses:
 *       200:
 *         description: Профіль успішно оновлено
 *       400:
 *         description: Помилка валідації даних
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, age, gender, height, weight, activityLevel, goal } = req.body as ProfileUpdate;

    // Валідація даних
    const updateData: Partial<ProfileUpdate> = {};

    if (name !== undefined) {
      updateData.name = name || null;
    }

    if (age !== undefined) {
      const ageNum = age ? parseInt(String(age)) : null;
      if (ageNum !== null && (isNaN(ageNum) || ageNum < 1 || ageNum > 150)) {
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
      const heightNum = height ? parseFloat(String(height)) : null;
      if (heightNum !== null && (isNaN(heightNum) || heightNum < 50 || heightNum > 300)) {
        return res.status(400).json({ error: 'Зріст повинен бути від 50 до 300 см' });
      }
      updateData.height = heightNum;
    }

    if (weight !== undefined) {
      const weightNum = weight ? parseFloat(String(weight)) : null;
      if (weightNum !== null && (isNaN(weightNum) || weightNum < 1 || weightNum > 500)) {
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
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'AuthController',
      operation: 'updateProfile',
      errorTitle: 'Помилка оновлення профілю',
      userMessage: 'Не вдалося оновити дані профілю.',
    });
  }
};

