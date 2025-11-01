import { PrismaClient } from '@prisma/client';
import { DEFAULT_USER_ID } from '../src/lib/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding predefined programs...');

  // Get exercises for programs
  const pushups = await prisma.exercise.findUnique({ where: { name: 'Push-ups' } });
  const planks = await prisma.exercise.findUnique({ where: { name: 'Plank' } });
  const squats = await prisma.exercise.findUnique({ where: { name: 'Squats' } });
  const lunges = await prisma.exercise.findUnique({ where: { name: 'Lunges' } });
  const crunches = await prisma.exercise.findUnique({ where: { name: 'Crunches' } });
  const running = await prisma.exercise.findUnique({ where: { name: 'Running' } });
  const stretching = await prisma.exercise.findUnique({ where: { name: 'Stretching' } });
  const pullups = await prisma.exercise.findUnique({ where: { name: 'Pull-ups' } });
  const bicep = await prisma.exercise.findUnique({ where: { name: 'Bicep Curls' } });
  const lateral = await prisma.exercise.findUnique({ where: { name: 'Lateral Raises' } });
  const jumpRope = await prisma.exercise.findUnique({ where: { name: 'Jump Rope' } });
  const benchPress = await prisma.exercise.findUnique({ where: { name: 'Bench Press' } });
  const deadlift = await prisma.exercise.findUnique({ where: { name: 'Deadlift' } });
  const overhead = await prisma.exercise.findUnique({ where: { name: 'Overhead Press' } });
  const barbellSquat = await prisma.exercise.findUnique({ where: { name: 'Barbell Squat' } });

  if (!pushups || !planks || !squats || !lunges || !crunches || !running || !stretching) {
    console.log('⚠️ Some exercises not found, skipping program seed');
    return;
  }

  let created = 0;

  // Program 1: Beginner Full Body (3 days/week)
  const beginnerExists = await prisma.program.findFirst({
    where: { name: 'Beginner Full Body Starter' }
  });

  if (!beginnerExists && pushups && planks && squats && crunches && stretching) {
    await prisma.program.create({
      data: {
        name: 'Beginner Full Body Starter',
        nameUk: 'Для початківців: Повне тіло',
        description: 'Perfect starting point for fitness beginners - 3 days per week',
        descriptionUk: 'Ідеальний старт для початківців - 3 дні на тиждень',
        goal: 'maintain',
        difficulty: 'beginner',
        duration: 28, // 4 weeks
        isDefault: true,
        exercises: {
          create: [
            // Day 1 - Upper body
            { day: 1, week: 1, exerciseId: pushups.id, sets: 3, reps: 10, rest: 60, order: 0, notes: 'Для набору базової сили' },
            { day: 1, week: 1, exerciseId: planks.id, duration: 30, order: 1, notes: 'Утримуй 30 секунд' },
            { day: 1, week: 1, exerciseId: crunches.id, sets: 3, reps: 12, rest: 45, order: 2 },
            { day: 1, week: 1, exerciseId: stretching.id, duration: 10, order: 3 },
            // Day 2 - Lower body
            { day: 2, week: 1, exerciseId: squats.id, sets: 3, reps: 12, rest: 60, order: 0 },
            { day: 2, week: 1, exerciseId: lunges.id, sets: 3, reps: 10, rest: 60, order: 1 },
            { day: 2, week: 1, exerciseId: planks.id, duration: 30, order: 2 },
            { day: 2, week: 1, exerciseId: stretching.id, duration: 10, order: 3 },
            // Day 3 - Cardio + Core
            { day: 3, week: 1, exerciseId: running.id, duration: 15, order: 0, notes: 'Помірний темп' },
            { day: 3, week: 1, exerciseId: crunches.id, sets: 3, reps: 12, rest: 45, order: 1 },
            { day: 3, week: 1, exerciseId: planks.id, duration: 30, order: 2 },
            { day: 3, week: 1, exerciseId: stretching.id, duration: 10, order: 3 }
          ]
        }
      }
    });
    created++;
    console.log('✅ Created: Beginner Full Body Starter');
  }

  // Program 2: Weight Loss Intensive (4-5 days/week)
  const weightLossExists = await prisma.program.findFirst({
    where: { name: 'Weight Loss Intensive' }
  });

  if (!weightLossExists && pushups && squats && lunges && running && jumpRope && crunches) {
    await prisma.program.create({
      data: {
        name: 'Weight Loss Intensive',
        nameUk: 'Інтенсивне схуднення',
        description: 'High-intensity fat burning program - 5 days per week',
        descriptionUk: 'Високоінтенсивна програма спалення жиру - 5 днів на тиждень',
        goal: 'lose_weight',
        difficulty: 'intermediate',
        duration: 42, // 6 weeks
        isDefault: true,
        exercises: {
          create: [
            // Day 1 - HIIT Cardio
            { day: 1, week: 1, exerciseId: jumpRope.id, duration: 20, order: 0, notes: 'Інтервали 30/30' },
            { day: 1, week: 1, exerciseId: planks.id, duration: 45, order: 1, notes: '3 підходи' },
            { day: 1, week: 1, exerciseId: crunches.id, sets: 4, reps: 15, rest: 30, order: 2 },
            // Day 2 - Full Body Strength
            { day: 2, week: 1, exerciseId: squats.id, sets: 4, reps: 15, rest: 45, order: 0 },
            { day: 2, week: 1, exerciseId: pushups.id, sets: 4, reps: 12, rest: 45, order: 1 },
            { day: 2, week: 1, exerciseId: lunges.id, sets: 3, reps: 12, rest: 45, order: 2 },
            { day: 2, week: 1, exerciseId: crunches.id, sets: 3, reps: 15, rest: 30, order: 3 },
            // Day 3 - Cardio
            { day: 3, week: 1, exerciseId: running.id, duration: 30, order: 0, notes: 'Стабільний темп' },
            { day: 3, week: 1, exerciseId: stretching.id, duration: 15, order: 1 },
            // Day 4 - Upper Body
            { day: 4, week: 1, exerciseId: pushups.id, sets: 4, reps: 15, rest: 45, order: 0 },
            { day: 4, week: 1, exerciseId: planks.id, duration: 60, order: 1, notes: '2 підходи' },
            { day: 4, week: 1, exerciseId: crunches.id, sets: 4, reps: 15, rest: 30, order: 2 },
            // Day 5 - Lower Body
            { day: 5, week: 1, exerciseId: squats.id, sets: 4, reps: 20, rest: 45, order: 0 },
            { day: 5, week: 1, exerciseId: lunges.id, sets: 3, reps: 15, rest: 45, order: 1 },
            { day: 5, week: 1, exerciseId: running.id, duration: 20, order: 2, notes: 'Легкий біг' },
            { day: 5, week: 1, exerciseId: stretching.id, duration: 15, order: 3 }
          ]
        }
      }
    });
    created++;
    console.log('✅ Created: Weight Loss Intensive');
  }

  // Program 3: Muscle Building (Beginner gym)
  const muscleBuildExists = await prisma.program.findFirst({
    where: { name: 'Beginner Muscle Building' }
  });

  if (!muscleBuildExists && benchPress && bicep && lateral && barbellSquat && overhead && deadlift && planks && crunches) {
    await prisma.program.create({
      data: {
        name: 'Beginner Muscle Building',
        nameUk: 'Набір маси для початківців',
        description: 'Structured muscle building program - 4 days per week',
        descriptionUk: 'Структурована програма набору маси - 4 дні на тиждень',
        goal: 'gain_muscle',
        difficulty: 'beginner',
        duration: 56, // 8 weeks
        isDefault: true,
        exercises: {
          create: [
            // Day 1 - Chest & Triceps
            { day: 1, week: 1, exerciseId: benchPress.id, sets: 4, reps: 8, rest: 90, order: 0, notes: 'Для набору м\'язової маси' },
            { day: 1, week: 1, exerciseId: planks.id, duration: 45, order: 1 },
            { day: 1, week: 1, exerciseId: crunches.id, sets: 3, reps: 15, rest: 45, order: 2 },
            // Day 2 - Back & Biceps
            { day: 2, week: 1, exerciseId: deadlift.id, sets: 3, reps: 5, rest: 120, order: 0, notes: 'Важливо: правильна техніка!' },
            { day: 2, week: 1, exerciseId: bicep.id, sets: 3, reps: 12, rest: 60, order: 1 },
            { day: 2, week: 1, exerciseId: planks.id, duration: 60, order: 2 },
            // Day 3 - Legs & Shoulders
            { day: 3, week: 1, exerciseId: barbellSquat.id, sets: 4, reps: 10, rest: 90, order: 0 },
            { day: 3, week: 1, exerciseId: overhead.id, sets: 3, reps: 8, rest: 90, order: 1 },
            { day: 3, week: 1, exerciseId: lateral.id, sets: 3, reps: 12, rest: 60, order: 2 },
            { day: 3, week: 1, exerciseId: stretching.id, duration: 15, order: 3 },
            // Day 4 - Active Recovery
            { day: 4, week: 1, exerciseId: stretching.id, duration: 20, order: 0 }
          ]
        }
      }
    });
    created++;
    console.log('✅ Created: Beginner Muscle Building');
  }

  // Program 4: Home Workout (No equipment)
  const homeExists = await prisma.program.findFirst({
    where: { name: 'Home Warrior' }
  });

  if (!homeExists && pushups && squats && lunges && planks && crunches && stretching && jumpRope) {
    await prisma.program.create({
      data: {
        name: 'Home Warrior',
        nameUk: 'Домашній воїн',
        description: 'Complete bodyweight workout - no equipment needed',
        descriptionUk: 'Повне тіло без обладнання',
        goal: 'maintain',
        difficulty: 'intermediate',
        duration: 28, // 4 weeks
        isDefault: true,
        exercises: {
          create: [
            // Day 1 - Upper Body
            { day: 1, week: 1, exerciseId: pushups.id, sets: 4, reps: 15, rest: 60, order: 0 },
            { day: 1, week: 1, exerciseId: planks.id, duration: 60, order: 1, notes: '2 підходи' },
            { day: 1, week: 1, exerciseId: crunches.id, sets: 4, reps: 20, rest: 45, order: 2 },
            { day: 1, week: 1, exerciseId: stretching.id, duration: 10, order: 3 },
            // Day 2 - Lower Body
            { day: 2, week: 1, exerciseId: squats.id, sets: 4, reps: 20, rest: 60, order: 0 },
            { day: 2, week: 1, exerciseId: lunges.id, sets: 3, reps: 15, rest: 60, order: 1 },
            { day: 2, week: 1, exerciseId: planks.id, duration: 60, order: 2 },
            { day: 2, week: 1, exerciseId: stretching.id, duration: 10, order: 3 },
            // Day 3 - Cardio
            { day: 3, week: 1, exerciseId: jumpRope.id, duration: 25, order: 0, notes: 'Інтервали' },
            { day: 3, week: 1, exerciseId: crunches.id, sets: 3, reps: 20, rest: 45, order: 1 },
            { day: 3, week: 1, exerciseId: stretching.id, duration: 15, order: 2 }
          ]
        }
      }
    });
    created++;
    console.log('✅ Created: Home Warrior');
  }

  // Program 5: Endurance Builder
  const enduranceExists = await prisma.program.findFirst({
    where: { name: 'Endurance Builder' }
  });

  if (!enduranceExists && running && jumpRope && pushups && squats && planks && stretching) {
    await prisma.program.create({
      data: {
        name: 'Endurance Builder',
        nameUk: 'Розвиток витривалості',
        description: 'Build cardiovascular and muscular endurance',
        descriptionUk: 'Розвиток серцево-судинної та м\'язової витривалості',
        goal: 'endurance',
        difficulty: 'intermediate',
        duration: 42, // 6 weeks
        isDefault: true,
        exercises: {
          create: [
            // Day 1 - Cardio
            { day: 1, week: 1, exerciseId: running.id, duration: 30, order: 0, notes: 'Помірний темп' },
            { day: 1, week: 1, exerciseId: stretching.id, duration: 15, order: 1 },
            // Day 2 - Strength Endurance
            { day: 2, week: 1, exerciseId: pushups.id, sets: 4, reps: 20, rest: 45, order: 0 },
            { day: 2, week: 1, exerciseId: squats.id, sets: 4, reps: 20, rest: 45, order: 1 },
            { day: 2, week: 1, exerciseId: planks.id, duration: 60, order: 2 },
            { day: 2, week: 1, exerciseId: stretching.id, duration: 10, order: 3 },
            // Day 4 - HIIT
            { day: 4, week: 1, exerciseId: jumpRope.id, duration: 20, order: 0, notes: 'Інтервали 45/15' },
            { day: 4, week: 1, exerciseId: planks.id, duration: 45, order: 1 },
            { day: 4, week: 1, exerciseId: stretching.id, duration: 10, order: 2 },
            // Day 5 - Long Cardio
            { day: 5, week: 1, exerciseId: running.id, duration: 40, order: 0, notes: 'Легкий темп' },
            { day: 5, week: 1, exerciseId: stretching.id, duration: 20, order: 1 },
            // Day 6 - Circuit Training
            { day: 6, week: 1, exerciseId: pushups.id, sets: 3, reps: 15, rest: 30, order: 0 },
            { day: 6, week: 1, exerciseId: squats.id, sets: 3, reps: 15, rest: 30, order: 1 },
            { day: 6, week: 1, exerciseId: lunges.id, sets: 3, reps: 12, rest: 30, order: 2 },
            { day: 6, week: 1, exerciseId: planks.id, duration: 45, order: 3 },
            { day: 6, week: 1, exerciseId: stretching.id, duration: 15, order: 4 }
          ]
        }
      }
    });
    created++;
    console.log('✅ Created: Endurance Builder');
  }

  console.log(`✅ Seeded ${created} predefined programs`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding programs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

