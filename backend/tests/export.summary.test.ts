/**
 * @file: export.summary.test.ts
 * @description: Тести для утиліт розрахунку підсумків експорту
 * @dependencies: jest
 * @created: 2025-11-07
 */
import { buildWorkoutSummary, buildNutritionSummary } from '../src/services/exportSummary';

describe('Export summary helpers', () => {
  it('calc workout summary', () => {
    const baseDate = new Date('2025-01-01T10:00:00Z');
    const summary = buildWorkoutSummary([
      {
        date: baseDate,
        duration: 60,
        rating: 4,
        exercises: [1, 2],
      },
      {
        date: new Date('2025-01-03T10:00:00Z'),
        duration: 30,
        rating: 5,
        exercises: [1],
      },
      {
        date: new Date('2025-01-02T10:00:00Z'),
        duration: null,
        rating: null,
        exercises: [],
      },
    ]);

    expect(summary.totalWorkouts).toBe(3);
    expect(summary.totalDuration).toBe(90);
    expect(summary.averageDuration).toBeCloseTo(30);
    expect(summary.totalExercises).toBe(3);
    expect(summary.averageRating).toBeCloseTo(4.5);
    expect(summary.dateRange.start?.toISOString()).toBe(baseDate.toISOString());
    expect(summary.dateRange.end?.toISOString()).toBe('2025-01-03T10:00:00.000Z');
  });

  it('calc nutrition summary', () => {
    const summary = buildNutritionSummary([
      {
        date: new Date('2025-02-01T08:00:00Z'),
        mealType: 'breakfast',
        items: [
          { calories: 300, protein: 20, carbs: 40, fat: 10 },
          { calories: 150, protein: 10, carbs: 20, fat: 5 },
        ],
      },
      {
        date: new Date('2025-02-01T12:00:00Z'),
        mealType: 'lunch',
        items: [{ calories: 600, protein: 35, carbs: 50, fat: 20 }],
      },
      {
        date: new Date('2025-02-02T19:00:00Z'),
        mealType: 'dinner',
        items: [{ calories: 500, protein: 30, carbs: 40, fat: 25 }],
      },
    ]);

    expect(summary.totalLogs).toBe(3);
    expect(summary.totalCalories).toBeCloseTo(1550);
    expect(summary.totalProtein).toBeCloseTo(95);
    expect(summary.totalCarbs).toBeCloseTo(150);
    expect(summary.totalFat).toBeCloseTo(60);
    expect(summary.averageCaloriesPerLog).toBeCloseTo(516.67, 1);
    expect(summary.averageCaloriesPerDay).toBeCloseTo(775, 1);
    expect(summary.mealTypeDistribution).toEqual({
      breakfast: 1,
      lunch: 1,
      dinner: 1,
    });
    expect(summary.dateRange.start?.toISOString()).toBe('2025-02-01T08:00:00.000Z');
    expect(summary.dateRange.end?.toISOString()).toBe('2025-02-02T19:00:00.000Z');
  });

  it('handles empty arrays gracefully', () => {
    const workoutSummary = buildWorkoutSummary([]);
    expect(workoutSummary.totalWorkouts).toBe(0);
    expect(workoutSummary.totalDuration).toBe(0);

    const nutritionSummary = buildNutritionSummary([]);
    expect(nutritionSummary.totalLogs).toBe(0);
    expect(nutritionSummary.totalCalories).toBe(0);
  });
});


