/**
 * @file: exportSummary.ts
 * @description: Утиліти для розрахунку підсумків експортованих даних
 * @dependencies: none
 * @created: 2025-11-07
 */

export interface WorkoutSummaryInput {
  date: Date;
  duration: number | null;
  rating: number | null;
  exercises: Array<unknown>;
}

export interface WorkoutSummary {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
  totalExercises: number;
  averageRating: number;
  dateRange: { start?: Date; end?: Date };
}

export interface NutritionItemSummaryInput {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionSummaryInput {
  date: Date;
  mealType: string;
  items: NutritionItemSummaryInput[];
}

export interface NutritionSummary {
  totalLogs: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  averageCaloriesPerLog: number;
  averageCaloriesPerDay: number;
  mealTypeDistribution: Record<string, number>;
  dateRange: { start?: Date; end?: Date };
}

export const buildWorkoutSummary = (workouts: WorkoutSummaryInput[]): WorkoutSummary => {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0,
      totalExercises: 0,
      averageRating: 0,
      dateRange: {},
    };
  }

  let totalDuration = 0;
  let totalExercises = 0;
  let totalRating = 0;
  let ratingCount = 0;
  let startDate = workouts[0].date;
  let endDate = workouts[0].date;

  workouts.forEach(workout => {
    if (workout.duration) {
      totalDuration += workout.duration;
    }

    if (Array.isArray(workout.exercises)) {
      totalExercises += workout.exercises.length;
    }

    if (workout.rating !== null && workout.rating !== undefined) {
      totalRating += workout.rating;
      ratingCount += 1;
    }

    if (workout.date < startDate) {
      startDate = workout.date;
    }

    if (workout.date > endDate) {
      endDate = workout.date;
    }
  });

  const totalWorkouts = workouts.length;
  const averageDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

  return {
    totalWorkouts,
    totalDuration,
    averageDuration,
    totalExercises,
    averageRating,
    dateRange: { start: startDate, end: endDate },
  };
};

export const buildNutritionSummary = (logs: NutritionSummaryInput[]): NutritionSummary => {
  if (logs.length === 0) {
    return {
      totalLogs: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      averageCaloriesPerLog: 0,
      averageCaloriesPerDay: 0,
      mealTypeDistribution: {},
      dateRange: {},
    };
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  const mealTypeDistribution: Record<string, number> = {};
  const dayTotals = new Map<string, number>();
  let startDate = logs[0].date;
  let endDate = logs[0].date;

  logs.forEach(log => {
    const dayKey = log.date.toISOString().split('T')[0];

    mealTypeDistribution[log.mealType] = (mealTypeDistribution[log.mealType] || 0) + 1;

    let logCalories = 0;

    log.items.forEach(item => {
      totalCalories += item.calories;
      totalProtein += item.protein;
      totalCarbs += item.carbs;
      totalFat += item.fat;
      logCalories += item.calories;
    });

    dayTotals.set(dayKey, (dayTotals.get(dayKey) || 0) + logCalories);

    if (log.date < startDate) {
      startDate = log.date;
    }

    if (log.date > endDate) {
      endDate = log.date;
    }
  });

  const totalLogs = logs.length;
  const uniqueDays = dayTotals.size || 1;

  return {
    totalLogs,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    averageCaloriesPerLog: totalLogs > 0 ? totalCalories / totalLogs : 0,
    averageCaloriesPerDay: uniqueDays > 0 ? totalCalories / uniqueDays : 0,
    mealTypeDistribution,
    dateRange: { start: startDate, end: endDate },
  };
};


