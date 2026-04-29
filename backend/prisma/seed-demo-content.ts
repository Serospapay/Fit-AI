import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@example.com';

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`Демо-користувача ${DEMO_EMAIL} не знайдено. Спочатку виконай prisma:seed:user`);
  }

  const allExercises = await prisma.exercise.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true },
  });
  const ukrainianExercises = allExercises.filter((exercise) =>
    /[А-Яа-яІіЇїЄєҐґ]/.test(exercise.name),
  );
  const exercises =
    ukrainianExercises.length >= 6
      ? ukrainianExercises
      : allExercises;

  await prisma.workoutExercise.deleteMany({
    where: { workout: { userId: user.id } },
  });
  await prisma.workout.deleteMany({ where: { userId: user.id } });
  await prisma.nutritionItem.deleteMany({
    where: { nutritionLog: { userId: user.id } },
  });
  await prisma.nutritionLog.deleteMany({ where: { userId: user.id } });
  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.reminder.deleteMany({ where: { userId: user.id } });
  await prisma.recommendation.deleteMany({ where: { userId: user.id } });
  await prisma.workoutTemplate.deleteMany({ where: { userId: user.id } });

  const createdWorkouts: string[] = [];

  const workoutsData = [
    { days: 1, type: 'strength', duration: 60, rating: 5, notes: 'Силове тренування: ноги + корпус' },
    { days: 3, type: 'cardio', duration: 40, rating: 4, notes: 'Біг у зоні 2 + інтервали' },
    { days: 5, type: 'strength', duration: 55, rating: 5, notes: 'Верх тіла: груди + спина' },
    { days: 7, type: 'flexibility', duration: 35, rating: 4, notes: 'Мобільність + розтяжка' },
    { days: 9, type: 'strength', duration: 65, rating: 5, notes: 'База: присідання, жим, тяга' },
    { days: 12, type: 'cardio', duration: 45, rating: 4, notes: 'Кардіо тренування середньої інтенсивності' },
    { days: 15, type: 'mixed', duration: 50, rating: 4, notes: 'Комбіноване тренування' },
    { days: 18, type: 'strength', duration: 58, rating: 5, notes: 'Силове: ноги + плечі' },
  ];

  for (let i = 0; i < workoutsData.length; i += 1) {
    const w = workoutsData[i];
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        date: daysAgo(w.days),
        type: w.type,
        duration: w.duration,
        rating: w.rating,
        notes: w.notes,
        status: 'completed',
      },
      select: { id: true },
    });

    createdWorkouts.push(workout.id);

    if (exercises.length >= 3) {
      const e1 = exercises[i % exercises.length];
      const e2 = exercises[(i + 2) % exercises.length];
      const e3 = exercises[(i + 4) % exercises.length];

      await prisma.workoutExercise.createMany({
        data: [
          {
            workoutId: workout.id,
            exerciseId: e1.id,
            sets: 4,
            reps: 8,
            weight: 50 + i * 2,
            order: 1,
          },
          {
            workoutId: workout.id,
            exerciseId: e2.id,
            sets: 3,
            reps: 10,
            weight: 35 + i * 1.5,
            order: 2,
          },
          {
            workoutId: workout.id,
            exerciseId: e3.id,
            sets: 3,
            reps: 12,
            weight: 20 + i,
            order: 3,
          },
        ],
      });
    }
  }

  const nutritionLogsData = [
    {
      days: 0,
      mealType: 'breakfast',
      items: [
        { name: 'Вівсянка', amount: 80, calories: 311, protein: 13.6, carbs: 52.8, fat: 5.6 },
        { name: 'Банан', amount: 120, calories: 107, protein: 1.3, carbs: 27.6, fat: 0.4 },
      ],
    },
    {
      days: 0,
      mealType: 'lunch',
      items: [
        { name: 'Куряча грудка', amount: 180, calories: 297, protein: 55.8, carbs: 0, fat: 6.5 },
        { name: 'Рис', amount: 150, calories: 195, protein: 4.1, carbs: 42, fat: 0.5 },
      ],
    },
    {
      days: 1,
      mealType: 'dinner',
      items: [
        { name: 'Риба (лосось)', amount: 170, calories: 353, protein: 34, carbs: 0, fat: 20.4 },
        { name: 'Броколі', amount: 120, calories: 41, protein: 3.4, carbs: 8.4, fat: 0.5 },
      ],
    },
    {
      days: 2,
      mealType: 'snack',
      items: [
        { name: 'Йогурт', amount: 200, calories: 118, protein: 20, carbs: 7.2, fat: 0.8 },
        { name: 'Мігдаль', amount: 30, calories: 174, protein: 6.3, carbs: 6.6, fat: 15 },
      ],
    },
    {
      days: 3,
      mealType: 'lunch',
      items: [
        { name: 'Яловичина', amount: 170, calories: 425, protein: 44.2, carbs: 0, fat: 28.9 },
        { name: 'Гречка', amount: 140, calories: 280, protein: 10.6, carbs: 50.4, fat: 2.8 },
      ],
    },
    {
      days: 5,
      mealType: 'dinner',
      items: [
        { name: 'Індичка', amount: 180, calories: 340, protein: 52.2, carbs: 0, fat: 12.6 },
        { name: 'Огірок', amount: 150, calories: 24, protein: 1.1, carbs: 6, fat: 0.2 },
      ],
    },
  ];

  for (const log of nutritionLogsData) {
    const nutritionLog = await prisma.nutritionLog.create({
      data: {
        userId: user.id,
        date: daysAgo(log.days),
        mealType: log.mealType,
      },
      select: { id: true },
    });

    await prisma.nutritionItem.createMany({
      data: log.items.map((item) => ({
        nutritionLogId: nutritionLog.id,
        ...item,
      })),
    });
  }

  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        title: 'Схуднути на 4 кг',
        category: 'weight',
        targetValue: 76,
        currentValue: 79.2,
        unit: 'кг',
        status: 'active',
        startDate: daysAgo(20),
        targetDate: daysAgo(-40),
      },
      {
        userId: user.id,
        title: 'Підтягування 12 разів',
        category: 'strength',
        targetValue: 12,
        currentValue: 8,
        unit: 'разів',
        status: 'active',
        startDate: daysAgo(18),
        targetDate: daysAgo(-30),
      },
      {
        userId: user.id,
        title: '10 000 кроків щодня',
        category: 'endurance',
        targetValue: 30,
        currentValue: 14,
        unit: 'днів',
        status: 'active',
        startDate: daysAgo(14),
        targetDate: daysAgo(-16),
      },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      {
        userId: user.id,
        type: 'workout',
        title: 'Вечірнє тренування',
        message: 'Час зробити тренування за планом',
        time: '19:00',
        daysOfWeek: JSON.stringify([1, 3, 5]),
        enabled: true,
      },
      {
        userId: user.id,
        type: 'nutrition',
        title: 'Контроль води',
        message: 'Випий склянку води',
        time: '11:00',
        daysOfWeek: JSON.stringify([1, 2, 3, 4, 5, 6, 0]),
        enabled: true,
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        userId: user.id,
        type: 'workout',
        title: 'Додай розминку перед силовим днем',
        message: '5-7 хвилин динамічної розминки знизять ризик травм і покращать техніку.',
        priority: 'high',
        isRead: false,
      },
      {
        userId: user.id,
        type: 'nutrition',
        title: 'Тримай стабільний білок',
        message: 'Ціль на день: 1.6-2.0 г білка на кг маси тіла для збереження мʼязів.',
        priority: 'normal',
        isRead: false,
      },
      {
        userId: user.id,
        type: 'progress',
        title: 'Хороший темп прогресу',
        message: 'Ти вже закрив 8 тренувань за останні 3 тижні. Тримай ритм.',
        priority: 'normal',
        isRead: true,
      },
    ],
  });

  await prisma.workoutTemplate.createMany({
    data: [
      {
        userId: user.id,
        name: 'Силова база (верх)',
        description: 'Жим + тяга + плечі',
        type: 'strength',
        exercises: [
          { name: 'Жим лежачи', sets: 4, reps: 6 },
          { name: 'Тяга штанги в нахилі', sets: 4, reps: 8 },
          { name: 'Жим сидячи/стоячи', sets: 3, reps: 10 },
        ],
      },
      {
        userId: user.id,
        name: 'Кардіо 40 хв',
        description: 'Рівномірне кардіо + короткі інтервали',
        type: 'cardio',
        exercises: [
          { name: 'Біг', durationMin: 30 },
          { name: 'Стрибки на скакалці', durationMin: 10 },
        ],
      },
    ],
  });

  await prisma.quote.createMany({
    data: [
      {
        text: 'Маленькі щоденні кроки дають великі результати.',
        author: 'Кишеньковий тренер',
        category: 'motivation',
      },
      {
        text: 'Стабільність важливіша за ідеальність.',
        author: 'Кишеньковий тренер',
        category: 'motivation',
      },
      {
        text: 'План, дисципліна і відновлення - твоя формула прогресу.',
        author: 'Кишеньковий тренер',
        category: 'fitness',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Демо-контент успішно створено:');
  console.log(`- Тренувань: ${createdWorkouts.length}`);
  console.log(`- Логів харчування: ${nutritionLogsData.length}`);
  console.log('- Цілей: 3');
  console.log('- Нагадувань: 2');
  console.log('- Рекомендацій: 3');
  console.log('- Шаблонів тренувань: 2');
  console.log('- Мотиваційних цитат: 3');
}

main()
  .catch((e) => {
    console.error('Помилка seed demo content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

