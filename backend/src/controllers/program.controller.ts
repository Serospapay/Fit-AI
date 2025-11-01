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

    // Визначаємо структуру програми залежно від мети
    const programStructure = generateProgramStructure(
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
          create: programStructure.map((dayPlan, dayIndex) => ({
            day: dayIndex + 1,
            week: Math.floor(dayIndex / 7) + 1,
            exerciseId: dayPlan.exerciseId,
            sets: dayPlan.sets,
            reps: dayPlan.reps,
            duration: dayPlan.duration,
            rest: dayPlan.rest,
            order: dayPlan.order,
            notes: dayPlan.notes
          }))
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
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  order: number;
  notes?: string;
}> {
  const structure: Array<any> = [];
  let exerciseIndex = 0;

  // Розподіл вправ за групами м'язів
  const exercisesByMuscleGroup: { [key: string]: any[] } = {};
  exercises.forEach(ex => {
    const group = ex.muscleGroup || 'other';
    if (!exercisesByMuscleGroup[group]) {
      exercisesByMuscleGroup[group] = [];
    }
    exercisesByMuscleGroup[group].push(ex);
  });

  // Генеруємо план на тиждень
  for (let day = 1; day <= 7; day++) {
    // Визначаємо, які дні будуть тренувальними (наприклад, через день)
    const isTrainingDay = day % Math.ceil(7 / daysPerWeek) === 0 || day === 1;
    
    if (isTrainingDay) {
      // Вибір вправ залежно від мети
      const dayExercises = selectExercisesForDay(goal, exercisesByMuscleGroup, day);
      
      dayExercises.forEach((ex, index) => {
        const params = getExerciseParams(ex, goal);
        structure.push({
          exerciseId: ex.id,
          sets: params.sets,
          reps: params.reps,
          duration: params.duration,
          rest: params.rest,
          order: index,
          notes: params.notes
        });
      });
    }
  }

  return structure;
}

// Вибір вправ на конкретний день
function selectExercisesForDay(
  goal: string,
  exercisesByMuscleGroup: { [key: string]: any[] },
  day: number
): any[] {
  const selected: any[] = [];
  
  // Розподіл груп м'язів по днях для повного body або split
  const weekPlan: { [key: number]: string[] } = {
    1: ['chest', 'back', 'legs'],
    2: ['shoulders', 'arms'],
    3: ['core'],
    4: ['chest', 'back', 'legs'],
    5: ['shoulders', 'arms'],
    6: ['cardio', 'flexibility'],
    7: ['flexibility', 'balance']
  };

  const targetGroups = weekPlan[day] || ['full_body'];
  
  targetGroups.forEach(group => {
    const available = exercisesByMuscleGroup[group] || exercisesByMuscleGroup['full_body'];
    if (available && available.length > 0) {
      // Беремо до 3 вправ з кожної групи
      selected.push(...available.slice(0, 3));
    }
  });

  // Якщо мало вправ, додаємо з будь-яких доступних
  if (selected.length < 4) {
    Object.values(exercisesByMuscleGroup).forEach(group => {
      if (selected.length >= 6) return;
      group.forEach(ex => {
        if (!selected.includes(ex)) {
          selected.push(ex);
        }
      });
    });
  }

  return selected.slice(0, 6); // Макс 6 вправ на тренування
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

