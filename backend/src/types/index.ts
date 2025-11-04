/**
 * @file: types.ts
 * @description: Загальні типи та інтерфейси для backend
 * @dependencies: express, prisma
 * @created: 2024-11-04
 */

import { Request, Response } from 'express';

// Request з userId для автентифікованих роутів
export interface AuthRequest extends Request {
  userId?: string;
}

// Типи для вправ
export interface ExerciseInput {
  name: string;
}

export interface ExerciseUpdate {
  name?: string;
}

// Типи для тренувань
export interface WorkoutExerciseInput {
  exerciseId: string;
  customName?: string | null;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  duration?: number | null;
  distance?: number | null;
  rest?: number | null;
  order?: number;
  notes?: string | null;
}

export interface WorkoutInput {
  date?: string;
  type?: string | null;
  duration?: number | null;
  notes?: string | null;
  rating?: number | null;
  exercises?: WorkoutExerciseInput[];
}

export interface WorkoutUpdate {
  date?: string;
  type?: string | null;
  duration?: number | null;
  notes?: string | null;
  rating?: number | null;
  exercises?: WorkoutExerciseInput[];
}

// Типи для харчування
export interface NutritionItemInput {
  name: string;
  nameUk?: string | null;
  amount: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number | null;
}

export interface NutritionLogInput {
  date?: string;
  mealType: string;
  items: NutritionItemInput[];
}

// Типи для продуктів
export interface FoodInput {
  name: string;
  nameUk?: string | null;
  brand?: string | null;
  category?: string | null;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number | null;
}

export interface FoodUpdate {
  name?: string;
  nameUk?: string | null;
  brand?: string | null;
  category?: string | null;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number | null;
}

// Типи для профілю
export interface ProfileUpdate {
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  activityLevel?: string | null;
  goal?: string | null;
}

// Типи для фільтрів
export interface FilterOptions {
  search?: string;
  category?: string;
  type?: string;
  page?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
  mealType?: string;
}

// Типи для статистики
export interface WorkoutStats {
  totalWorkouts: number;
  avgDuration: number;
  avgRating: number;
  weekWorkouts: number;
  weekAvgDuration: number;
  monthWorkouts: number;
  monthAvgDuration: number;
  workoutStreak: number;
  exerciseTypeStats: Record<string, number>;
  recentWorkouts: any[];
  workoutsPerWeek?: Record<string, number>;
  achievements?: Achievement[];
  weeklyChartData?: WeeklyChartData[];
}

export interface Achievement {
  id: string;
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface WeeklyChartData {
  week: string;
  count: number;
}

export interface NutritionStats {
  totalLogs: number;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  avgPerDay: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealTypeStats: Record<string, number>;
  dailyBreakdown: DailyBreakdown[];
}

export interface DailyBreakdown {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Типи для помилок
export interface ApiError {
  error: string;
  message?: string;
}

// Типи для відповідей API
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

