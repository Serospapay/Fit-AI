import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_USER_ID } from '../src/lib/config';

const prisma = new PrismaClient();

const exercises = [
  // Chest exercises
  {
    name: 'Push-ups',
    nameUk: 'Віджимання від підлоги',
    description: 'Classic bodyweight chest exercise',
    descriptionUk: 'Класичне базове вправа для грудної клітки',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Keep your body straight, lower until chest almost touches floor, push back up',
    instructionsUk: 'Тримайте тіло прямо, опускайтеся до кількох сантиметрів від підлоги, виштовхуйтеся вгору',
    caloriesPerMin: 8
  },
  {
    name: 'Bench Press',
    nameUk: 'Жим лежачи',
    description: 'Barbell chest press lying on bench',
    descriptionUk: 'Жим штанги лежачи на лавці',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Lie on bench, lower bar to chest, press up to full extension',
    instructionsUk: 'Лягте на лавку, опустіть штангу до грудей, витисніть до повної руки',
    caloriesPerMin: 7
  },
  {
    name: 'Dumbbell Flyes',
    nameUk: 'Розведення гантелей',
    description: 'Isolation chest exercise with dumbbells',
    descriptionUk: 'Ізольована вправа для грудної клітки з гантелями',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    instructions: 'Lie on bench, arms extended, lower dumbbells in wide arc',
    instructionsUk: 'Лягте на лавку, руки витягнуті, опускайте гантелі широкою дугою',
    caloriesPerMin: 6
  },
  
  // Back exercises
  {
    name: 'Pull-ups',
    nameUk: 'Підтягування',
    description: 'Bodyweight back and bicep exercise',
    descriptionUk: 'Вправа для спини та біцепсів',
    type: 'strength',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    instructions: 'Hang from bar, pull body up until chin over bar',
    instructionsUk: 'Повисніть на перекладині, підтягніться до підборіддя над перекладиною',
    caloriesPerMin: 10
  },
  {
    name: 'Bent-over Row',
    nameUk: 'Тяга в нахилі',
    description: 'Barbell row for upper back',
    descriptionUk: 'Тяга штанги для верхньої частини спини',
    type: 'strength',
    muscleGroup: 'back',
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Bend forward, pull bar to lower chest',
    instructionsUk: 'Нахиліться вперед, тягніть штангу до нижньої частини грудей',
    caloriesPerMin: 7
  },
  {
    name: 'Lat Pulldown',
    nameUk: 'Тяга верхнього блоку',
    description: 'Machine exercise for latissimus dorsi',
    descriptionUk: 'Вправа на тренажері для широчайших м\'язів',
    type: 'strength',
    muscleGroup: 'back',
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: 'Pull bar down to upper chest, control release',
    instructionsUk: 'Тягніть перекладину вниз до грудей, контрольно відпускайте',
    caloriesPerMin: 6
  },
  
  // Leg exercises
  {
    name: 'Squats',
    nameUk: 'Присідання',
    description: 'Fundamental leg exercise',
    descriptionUk: 'Фундаментальна вправа для ніг',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Lower hips until thighs parallel to floor, stand back up',
    instructionsUk: 'Опускайте бедра до паралелі з підлогою, піднімайтеся',
    caloriesPerMin: 9
  },
  {
    name: 'Barbell Squat',
    nameUk: 'Присідання зі штангою',
    description: 'Weighted squat with barbell',
    descriptionUk: 'Присідання зі штангою',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Bar on shoulders, squat down deep',
    instructionsUk: 'Штанга на плечах, присядайте глибоко',
    caloriesPerMin: 8
  },
  {
    name: 'Deadlift',
    nameUk: 'Станова тяга',
    description: 'Full body compound lift',
    descriptionUk: 'Базове багатосуглобне вправа',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'advanced',
    instructions: 'Lift bar from floor to standing, keep back straight',
    instructionsUk: 'Піднімайте штангу з підлоги до повного випрямлення, тримайте спину прямою',
    caloriesPerMin: 9
  },
  {
    name: 'Lunges',
    nameUk: 'Випади',
    description: 'Unilateral leg exercise',
    descriptionUk: 'Одностороння вправа для ніг',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Step forward into lunge, both knees at 90 degrees',
    instructionsUk: 'Крок вперед у випаді, обидва коліна під кутом 90 градусів',
    caloriesPerMin: 7
  },
  
  // Arms exercises
  {
    name: 'Bicep Curls',
    nameUk: 'Підйоми на біцепс',
    description: 'Dumbbell bicep isolation',
    descriptionUk: 'Ізоляція біцепсів з гантелями',
    type: 'strength',
    muscleGroup: 'arms',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    instructions: 'Curl dumbbells to shoulders',
    instructionsUk: 'Згинайте гантелі до плечей',
    caloriesPerMin: 5
  },
  {
    name: 'Tricep Dips',
    nameUk: 'Віджимання на брусах',
    description: 'Bodyweight tricep exercise',
    descriptionUk: 'Вправа на трицепси',
    type: 'strength',
    muscleGroup: 'arms',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: 'Dip body down between parallel bars',
    instructionsUk: 'Опускайтеся на брусах',
    caloriesPerMin: 7
  },
  
  // Shoulders exercises
  {
    name: 'Overhead Press',
    nameUk: 'Жим стоячи',
    description: 'Barbell shoulder press',
    descriptionUk: 'Жим штанги над головою',
    type: 'strength',
    muscleGroup: 'shoulders',
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Press bar from shoulders to overhead',
    instructionsUk: 'Витискайте штангу з плечей над головою',
    caloriesPerMin: 7
  },
  {
    name: 'Lateral Raises',
    nameUk: 'Підйоми в сторони',
    description: 'Dumbbell shoulder isolation',
    descriptionUk: 'Ізоляція плечей з гантелями',
    type: 'strength',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    instructions: 'Raise dumbbells to shoulder height',
    instructionsUk: 'Піднімайте гантелі до рівня плечей',
    caloriesPerMin: 5
  },
  
  // Core exercises
  {
    name: 'Plank',
    nameUk: 'Планка',
    description: 'Core strength isometric hold',
    descriptionUk: 'Ізометрична вправа для кору',
    type: 'strength',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Hold straight body position on forearms',
    instructionsUk: 'Тримайте прямое тіло на передпліччях',
    caloriesPerMin: 4
  },
  {
    name: 'Crunches',
    nameUk: 'Скручування',
    description: 'Abdominal muscle exercise',
    descriptionUk: 'Вправа для м\'язів живота',
    type: 'strength',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: 'Lift shoulders off floor, crunch abs',
    instructionsUk: 'Піднімайте плечі з підлоги, скручуйте прес',
    caloriesPerMin: 6
  },
  
  // Cardio exercises
  {
    name: 'Running',
    nameUk: 'Біг',
    description: 'Cardiovascular endurance exercise',
    descriptionUk: 'Кардіо вправа для витривалості',
    type: 'cardio',
    muscleGroup: 'full_body',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Run at steady pace',
    instructionsUk: 'Біжіть у стабільному темпі',
    caloriesPerMin: 10
  },
  {
    name: 'Cycling',
    nameUk: 'Велосипед',
    description: 'Low impact cardio',
    descriptionUk: 'Низькоударне кардіо',
    type: 'cardio',
    muscleGroup: 'legs',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Pedal at consistent pace',
    instructionsUk: 'Крутіть педалі в стабільному темпі',
    caloriesPerMin: 8
  },
  {
    name: 'Jump Rope',
    nameUk: 'Стрибки на скакалці',
    description: 'High intensity cardio',
    descriptionUk: 'Високоінтенсивне кардіо',
    type: 'cardio',
    muscleGroup: 'full_body',
    equipment: 'none',
    difficulty: 'intermediate',
    instructions: 'Jump rope continuously',
    instructionsUk: 'Стрибайте на скакалці безперервно',
    caloriesPerMin: 12
  },
  
  // Flexibility exercises
  {
    name: 'Stretching',
    nameUk: 'Розтяжка',
    description: 'General flexibility routine',
    descriptionUk: 'Загальна розтяжка',
    type: 'flexibility',
    muscleGroup: 'full_body',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Hold stretches for 30 seconds',
    instructionsUk: 'Тримайте розтяжки по 30 секунд',
    caloriesPerMin: 2
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create default user if not exists
  const existingUser = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('default-password', 10);
    await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        email: 'user@fitness.local',
        passwordHash: hashedPassword,
        name: 'Мій Профіль'
      }
    });
    console.log('✅ Created default user');
  }

  // Seed exercises
  for (const exercise of exercises) {
    const existing = await prisma.exercise.findUnique({
      where: { name: exercise.name }
    });
    
    if (!existing) {
      await prisma.exercise.create({ data: exercise });
    }
  }

  console.log(`✅ Seeded ${exercises.length} exercises`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

