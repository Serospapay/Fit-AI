import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

// Отримати всі програми
export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const { goal, difficulty, duration } = req.query;

    const where: any = {};
    if (goal) where.goal = goal;
    if (difficulty) where.difficulty = difficulty;
    if (duration) where.duration = { lte: parseInt(duration as string) };

    const programs = await prisma.program.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: [
            { day: 'asc' },
            { order: 'asc' }
          ]
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ programs });
  } catch (error: any) {
    logger.error('Get all programs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати програму за ID
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: [
            { day: 'asc' },
            { week: 'asc' },
            { order: 'asc' }
          ]
        }
      }
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(program);
  } catch (error: any) {
    logger.error('Get program by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Розумний підбір програми на основі критеріїв користувача
export const generateSmartProgram = async (req: Request, res: Response) => {
  try {
    const {
      goal,
      difficulty,
      duration, // тижнів
      daysPerWeek,
      equipment, // що є в наявності
      location, // де тренуватися
      muscleGroups, // на які групи м'язів зробити акцент
      excludeInjuries // яких вправ уникати
    } = req.body;

    logger.info('Smart program generation request:', {
      goal,
      difficulty,
      duration,
      daysPerWeek,
      equipment,
      location
    });

    // Збираємо вправи, що підходять під критерії
    const exerciseCriteria: any = {};
    
    if (goal) {
      exerciseCriteria.goal = goal;
    }
    
    if (equipment && equipment.length > 0) {
      exerciseCriteria.equipment = { in: equipment };
    }
    
    if (location && location.length > 0) {
      exerciseCriteria.location = { in: location };
    }

    // Отримуємо всі підходящі вправи
    let exercises = await prisma.exercise.findMany({
      where: exerciseCriteria
    });

    // Якщо вказані групи м'язів, зосереджуємося на них
    if (muscleGroups && muscleGroups.length > 0) {
      const targetExercises = exercises.filter(ex => 
        ex.muscleGroup && muscleGroups.includes(ex.muscleGroup)
      );
      // Додаємо цільові вправи в початок списку
      exercises = [...targetExercises, ...exercises.filter(ex => 
        !ex.muscleGroup || !muscleGroups.includes(ex.muscleGroup)
      )];
    }

    // Фільтрація за рівнем складності
    const difficultyMap: { [key: string]: string[] } = {
      beginner: ['beginner'],
      intermediate: ['beginner', 'intermediate'],
      advanced: ['beginner', 'intermediate', 'advanced']
    };
    
    exercises = exercises.filter(ex => 
      difficultyMap[difficulty || 'intermediate'].includes(ex.difficulty)
    );

    // Виключаємо вправи з попередженнями про травми
    if (excludeInjuries && excludeInjuries.length > 0) {
      exercises = exercises.filter(ex => {
        if (!ex.warningsUk) return true;
        const warnings = ex.warningsUk.toLowerCase();
        return !excludeInjuries.some((injury: string) => 
          warnings.includes(injury.toLowerCase())
        );
      });
    }

    if (exercises.length === 0) {
      return res.status(400).json({ 
        error: 'Не вдалося знайти підходящі вправи за вказаними критеріями' 
      });
    }

    // Генеруємо програму
    const daysPerWeekNum = daysPerWeek || 3;
    const durationWeeks = duration || 4;
    const totalDays = durationWeeks * 7;

    // Визначаємо структуру програми залежно від мети (шаблон для 1 тижня)
    const weeklyTemplate = generateProgramStructure(
      goal || 'maintain',
      daysPerWeekNum,
      exercises
    );

    // Створюємо програму
    const program = await prisma.program.create({
      data: {
        name: `Персональна програма ${goal ? `(${goal})` : ''}`,
        nameUk: `Персональна програма ${goal ? `(${getGoalLabelUk(goal)})` : ''}`,
        description: `Автоматично згенерована програма тривалістю ${durationWeeks} тижні(ів)`,
        descriptionUk: `Автоматично згенерована програма тривалістю ${durationWeeks} тижні(ів)`,
        goal: goal || 'maintain',
        difficulty: difficulty || 'intermediate',
        duration: totalDays,
        exercises: {
          create: weeklyTemplate // Вже має правильну структуру з day та week
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: [
            { day: 'asc' },
            { order: 'asc' }
          ]
        }
      }
    });

    logger.info(`Smart program created: ${program.id}`);
    res.status(201).json(program);
  } catch (error: any) {
    logger.error('Generate smart program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Допоміжна функція для генерації структури програми
function generateProgramStructure(
  goal: string,
  daysPerWeek: number,
  exercises: any[]
): Array<{
  exerciseId: string;
  day: number;
  week: number;
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  order: number;
  notes?: string;
}> {
  const structure: Array<any> = [];

  // Розподіл вправ за групами м'язів
  const exercisesByMuscleGroup: { [key: string]: any[] } = {};
  exercises.forEach(ex => {
    const group = ex.muscleGroup || 'other';
    if (!exercisesByMuscleGroup[group]) {
      exercisesByMuscleGroup[group] = [];
    }
    exercisesByMuscleGroup[group].push(ex);
  });

  // Визначаємо план тренувань на тиждень (це ШАБЛОН для 1 тижня)
  const weeklyPlan = generateWeeklyPlan(goal, daysPerWeek, exercisesByMuscleGroup);

  return weeklyPlan; // Повертаємо готовий план з day та week
}

// Генерація плану на тиждень залежно від мети та кількості днів
function generateWeeklyPlan(
  goal: string,
  daysPerWeek: number,
  exercisesByMuscleGroup: { [key: string]: any[] }
): any[] {
  const structure: any[] = [];

  // Підбираємо стратегію тренувань залежно від мети
  const strategy = getTrainingStrategy(goal, daysPerWeek);

  // Генеруємо план для кожної тренувальної сесії
  strategy.forEach((dayGroups, sessionIndex) => {
    const dayExercises: any[] = [];

    dayGroups.forEach(group => {
      const available = exercisesByMuscleGroup[group] || exercisesByMuscleGroup['full_body'];
      if (available && available.length > 0) {
        // Беремо до 2-3 вправ з кожної групи залежно від мети
        const maxPerGroup = goal === 'gain_muscle' ? 3 : 2;
        dayExercises.push(...available.slice(0, maxPerGroup));
      }
    });

    // Якщо мало вправ, додаємо з інших груп
    if (dayExercises.length < 4) {
      const allGroups = Object.values(exercisesByMuscleGroup).flat();
      let added = 0;
      allGroups.forEach(ex => {
        if (added >= 4 || dayExercises.length >= 6) return;
        if (!dayExercises.includes(ex)) {
          dayExercises.push(ex);
          added++;
        }
      });
    }

    // Додаємо кожну вправу до структури з правильними day та week
    dayExercises.slice(0, 8).forEach((ex, order) => {
      const params = getExerciseParams(ex, goal);
      structure.push({
        exerciseId: ex.id,
        day: sessionIndex + 1, // День 1, 2, 3 (тренувальна сесія)
        week: 1, // Для генерації використовуємо тиждень 1 як шаблон
        sets: params.sets,
        reps: params.reps,
        duration: params.duration,
        rest: params.rest,
        order: order,
        notes: params.notes
      });
    });
  });

  return structure;
}

// Стратегія тренувань залежно від мети та кількості днів
function getTrainingStrategy(goal: string, daysPerWeek: number): string[][] {
  // Базові стратегії для різних мет
  const strategies: { [key: string]: { [key: number]: string[][] } } = {
    gain_muscle: {
      // Push/Pull/Legs split
      3: [['chest', 'shoulders', 'triceps'], ['back', 'biceps'], ['legs', 'core']],
      4: [['chest', 'shoulders'], ['back', 'biceps'], ['legs'], ['core', 'arms']],
      5: [['chest', 'triceps'], ['back', 'biceps'], ['shoulders', 'arms'], ['legs'], ['core']]
    },
    lose_weight: {
      // Full body + Cardio
      3: [['chest', 'back', 'core'], ['legs', 'shoulders'], ['cardio', 'core']],
      4: [['full_body'], ['full_body'], ['cardio', 'core'], ['full_body']],
      5: [['full_body'], ['cardio'], ['full_body'], ['cardio'], ['core']]
    },
    endurance: {
      // Cardio + Full body
      3: [['cardio', 'core'], ['full_body'], ['cardio', 'flexibility']],
      4: [['cardio'], ['full_body', 'core'], ['cardio'], ['flexibility', 'balance']],
      5: [['cardio'], ['full_body'], ['cardio'], ['full_body'], ['flexibility']]
    },
    maintain: {
      // Balanced approach
      3: [['chest', 'back', 'core'], ['legs', 'shoulders'], ['arms', 'flexibility']],
      4: [['full_body'], ['full_body'], ['cardio', 'core'], ['flexibility']],
      5: [['full_body'], ['cardio'], ['full_body'], ['core'], ['flexibility']]
    },
    definition: {
      // High volume, full body
      3: [['chest', 'core'], ['back', 'legs'], ['shoulders', 'arms']],
      4: [['chest', 'shoulders'], ['back', 'biceps'], ['legs'], ['core', 'triceps']],
      5: [['chest'], ['back'], ['legs'], ['shoulders'], ['core', 'arms']]
    }
  };

  const goalStrategy = strategies[goal] || strategies['maintain'];
  return goalStrategy[daysPerWeek] || goalStrategy[3];
}

// Параметри вправи залежно від мети
function getExerciseParams(exercise: any, goal: string): {
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  notes?: string;
} {
  const params: any = {};

  // Параметри залежать від типу та мети
  if (exercise.type === 'strength') {
    if (goal === 'gain_muscle') {
      params.sets = 4;
      params.reps = 8;
      params.rest = 90;
      params.notes = 'Для набору м\'язової маси';
    } else if (goal === 'endurance') {
      params.sets = 3;
      params.reps = 15;
      params.rest = 60;
      params.notes = 'Для витривалості';
    } else if (goal === 'definition') {
      params.sets = 3;
      params.reps = 12;
      params.rest = 45;
      params.notes = 'Для рельєфу';
    } else { // maintain, lose_weight
      params.sets = 3;
      params.reps = 10;
      params.rest = 60;
      params.notes = 'Балансована програма';
    }
  } else if (exercise.type === 'cardio') {
    params.duration = goal === 'lose_weight' ? 30 : 20;
    params.notes = 'Кардіо для витривалості';
  } else if (exercise.type === 'flexibility') {
    params.duration = 15;
    params.notes = 'Розтяжка для гнучкості';
  }

  return params;
}

// Допоміжні функції перекладів
function getGoalLabelUk(goal: string): string {
  const goals: { [key: string]: string } = {
    lose_weight: 'Схуднення',
    gain_muscle: 'Набір маси',
    maintain: 'Підтримка',
    endurance: 'Витривалість',
    definition: 'Рельєф'
  };
  return goals[goal] || goal;
}

// Створити програму вручну
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { name, nameUk, description, descriptionUk, goal, difficulty, duration, exercises, userId } = req.body;

    const program = await prisma.program.create({
      data: {
        name,
        nameUk,
        description,
        descriptionUk,
        goal,
        difficulty,
        duration,
        createdBy: userId,
        exercises: {
          create: exercises
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    logger.info(`Program created: ${program.id}`);
    res.status(201).json(program);
  } catch (error: any) {
    logger.error('Create program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Видалити програму
export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.program.delete({
      where: { id }
    });

    logger.info(`Program deleted: ${id}`);
    res.json({ message: 'Program deleted successfully' });
  } catch (error: any) {
    logger.error('Delete program error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

