import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_USER_ID } from '../src/lib/config';

const prisma = new PrismaClient();

const extendedExercises = [
  // CHEST EXERCISES
  {
    name: 'Push-ups',
    nameUk: 'Віджимання від підлоги',
    description: 'Classic bodyweight chest exercise that builds strength and endurance',
    descriptionUk: 'Класична базова вправа для грудної клітки, що розвиває силу та витривалість',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    location: 'home',
    instructions: 'Start in plank position. Lower your body until chest nearly touches floor. Push back up explosively.',
    instructionsUk: 'Почніть у позиції планки. Опускайте тіло до кількох сантиметрів від підлоги. Виштовхуйтеся швидко вгору.',
    tips: 'Keep core tight throughout. Don\'t let hips sag or raise. Breathe out on the way up.',
    tipsUk: 'Тримайте прес напруженим весь час. Не дозволяйте стегнам опускатися чи підніматися. Видихайте на виштовхуванні вгору.',
    warnings: 'Avoid if you have wrist pain. Place hands slightly wider than shoulders.',
    warningsUk: 'Не виконуйте при болі в зап\'ястках. Розмістіть руки трохи ширше за плечі.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    caloriesPerMin: 8
  },
  {
    name: 'Bench Press',
    nameUk: 'Жим лежачи',
    description: 'Barbell chest press lying on bench - the king of upper body exercises',
    descriptionUk: 'Жим штанги лежачи на лавці - король верхньої частини тіла',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'barbell',
    difficulty: 'intermediate',
    location: 'gym',
    instructions: 'Lie on bench with feet flat. Lower bar to chest, pause briefly. Press up explosively to lockout.',
    instructionsUk: 'Лягте на лавку, ноги на підлозі. Опустіть штангу до грудей, коротка пауза. Витисніть швидко до повної руки.',
    tips: 'Keep shoulder blades retracted. Don\'t bounce the bar off your chest. Use a spotter for safety.',
    tipsUk: 'Тримайте лопатки зведеними. Не відбивайте штангу від грудей. Використовуйте підстраховку для безпеки.',
    warnings: 'NOT for shoulder injuries. Start with light weight to perfect form. Always use safety bars or spotter.',
    warningsUk: 'ПРОТИПОКАЗАНО при травмах плечей. Почніть з легкої ваги для відточування техніки. Завжди використовуйте страховочні бруски чи підстраховку.',
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    caloriesPerMin: 7
  },
  {
    name: 'Dumbbell Flyes',
    nameUk: 'Розведення гантелей',
    description: 'Isolation chest exercise with dumbbells targeting pectoral muscles',
    descriptionUk: 'Ізольована вправа для грудної клітки з гантелями, що цілеспрямовано нагружає грудні м\'язи',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    location: 'gym',
    instructions: 'Lie on bench holding dumbbells overhead. Lower arms in wide arc until stretch felt in chest. Return to start.',
    instructionsUk: 'Лягте на лавку, тримаючи гантелі над головою. Опускайте руки широкою дугою до відчуття розтяжки в грудях. Поверніться в початкову позицію.',
    tips: 'Slight bend in elbows. Control the weight - don\'t let momentum do the work. Focus on chest contraction.',
    tipsUk: 'Невеликий згин у ліктях. Контролюйте вагу - не дозволяйте імпульсу виконувати роботу. Фокусуйтеся на скороченні грудей.',
    warnings: 'Avoid if shoulder issues. Start very light. Overstretching can cause injury.',
    warningsUk: 'Уникайте при проблемах з плечами. Почніть з дуже легкої ваги. Перерозтягнення може спричинити травму.',
    imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
    caloriesPerMin: 6
  },
  {
    name: 'Incline Dumbbell Press',
    nameUk: 'Жим гантелей на похилій лавці',
    description: 'Upper chest builder using inclined bench angle',
    descriptionUk: 'Розробка верхньої частини грудей з використанням похилої лавки',
    type: 'strength',
    muscleGroup: 'chest',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
    location: 'gym',
    instructions: 'Set bench to 30-45 degree angle. Press dumbbells up and slightly forward. Lower with control.',
    instructionsUk: 'Встановіть лавку під кутом 30-45 градусів. Витискайте гантелі вгору і трохи вперед. Опускайте контрольовано.',
    tips: 'Don\'t go too steep - 45 degrees is max. Arch slightly for better chest contraction.',
    tipsUk: 'Не встановлюйте занадто круто - максимум 45 градусів. Трохи вигніть спину для кращого скорочення грудей.',
    warnings: 'Shoulder-friendly alternative to incline barbell press. Start with lighter weight.',
    warningsUk: 'Більш дружній до плечей варіант, ніж жим штанги на похилій лавці. Почніть з легшої ваги.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=0G2_XV7slIg',
    caloriesPerMin: 7
  },
  
  // BACK EXERCISES
  {
    name: 'Pull-ups',
    nameUk: 'Підтягування',
    description: 'Bodyweight back and bicep exercise - ultimate upper body test',
    descriptionUk: 'Вправа для спини та біцепсів - тест верхньої частини тіла',
    type: 'strength',
    muscleGroup: 'back',
    equipment: 'bodyweight',
    difficulty: 'advanced',
    location: 'home',
    instructions: 'Hang from bar with overhand grip. Pull body up until chin clears bar. Lower with control.',
    instructionsUk: 'Повисніть на перекладині прямим хватом. Підтягніться до підборіддя над перекладиною. Опускайтеся контрольовано.',
    tips: 'Full range of motion. Avoid kipping or swinging. Use assistance bands if needed.',
    tipsUk: 'Повний діапазон руху. Уникайте поштовхів чи розгойдування. Використовуйте допоміжні резинки за потреби.',
    warnings: 'NOT for beginners. Build strength with negatives first. Wrist pain? Try different grips.',
    warningsUk: 'НЕ для початківців. Нарощуйте силу з негативними повтореннями. Біль в зап\'ястках? Спробуйте інші хвати.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    caloriesPerMin: 10
  },
  {
    name: 'Bent-over Row',
    nameUk: 'Тяга в нахилі',
    description: 'Barbell row for upper back thickness and strength',
    descriptionUk: 'Тяга штанги для маси та сили верхньої частини спини',
    type: 'strength',
    muscleGroup: 'back',
    equipment: 'barbell',
    difficulty: 'intermediate',
    location: 'gym',
    instructions: 'Bend forward 45 degrees. Pull bar to lower chest/upper abdomen. Squeeze back muscles hard.',
    instructionsUk: 'Нахиліться під кутом 45 градусів. Тягніть штангу до нижньої частини грудей/верхньої частини живота. Сильно стискайте м\'язи спини.',
    tips: 'Keep back straight. Don\'t row too high - elbows should go back, not up. Core tight throughout.',
    tipsUk: 'Тримайте спину прямою. Не тягніть занадто високо - лікті йдуть назад, не вгору. Преса напружений весь час.',
    warnings: 'Lower back stress. If pain occurs, reduce weight or switch to chest-supported row.',
    warningsUk: 'Навантаження на нижню частину спини. При болі зменште вагу або перейдіть на тягу з опорою грудей.',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=Y9oql7N1EJc',
    caloriesPerMin: 7
  },
  {
    name: 'Lat Pulldown',
    nameUk: 'Тяга верхнього блоку',
    description: 'Machine exercise for latissimus dorsi - beginner-friendly',
    descriptionUk: 'Вправа на тренажері для широчайших м\'язів - дружня до початківців',
    type: 'strength',
    muscleGroup: 'back',
    equipment: 'machine',
    difficulty: 'beginner',
    location: 'gym',
    instructions: 'Pull bar down to upper chest level. Squeeze lats at bottom. Control on way up.',
    instructionsUk: 'Тягніть перекладину вниз до рівня верхньої частини грудей. Стискайте ширші м\'язи внизу. Контролюйте на підйомі.',
    tips: 'Lean back slightly but don\'t swing. Pull with back, not arms. Full extension at top.',
    tipsUk: 'Трохи відхиліться назад, але не розгойдуйтесь. Тягніть спиною, а не руками. Повне розтягнення вгорі.',
    warnings: 'Good for building up to pull-ups. Focus on form over weight.',
    warningsUk: 'Добре для підготовки до підтягувань. Фокус на техніці, а не вазі.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    caloriesPerMin: 6
  },
  {
    name: 'Deadlift',
    nameUk: 'Станова тяга',
    description: 'Full body compound lift - greatest strength builder',
    descriptionUk: 'Багатосуглобна вправа для всього тіла - найкращий розвиток сили',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'advanced',
    location: 'gym',
    instructions: 'Stand with bar over mid-foot. Hinge at hips and knees. Keep back straight. Stand up explosively.',
    instructionsUk: 'Станьте зі штангою над серединою стопи. Рухайтеся в тазобедрених і колінних суглобах. Тримайте спину прямою. Піднімайтеся експлозивно.',
    tips: 'NEVER round your back! Shoulders over bar. Push through heels. Breathe and brace core.',
    tipsUk: 'НІКОЛИ не округлюйте спину! Плечі над штангою. Штовхайте п\'ятами. Дихайте і напружуйте прес.',
    warnings: 'CRITICAL: Proper form is essential! Get coaching before heavy weights. Back injuries if done wrong!',
    warningsUk: 'КРИТИЧНО: Правильна техніка обов\'язкова! Отримайте тренування перед важкими вагами. Травми спини при неправильному виконанні!',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    caloriesPerMin: 9
  },
  
  // LEG EXERCISES
  {
    name: 'Squats',
    nameUk: 'Присідання',
    description: 'Fundamental leg exercise for quadriceps, glutes, and core',
    descriptionUk: 'Фундаментальна вправа для ніг: квадрицепси, ягодиці та прес',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    location: 'home',
    instructions: 'Stand with feet shoulder-width. Lower hips back and down until thighs parallel. Stand up strongly.',
    instructionsUk: 'Станьте з ногами на ширині плечей. Опускайте стегна назад і вниз до паралелі з підлогою. Піднімайтеся сильно.',
    tips: 'Knees track over toes but don\'t cave in. Chest up. Depth varies by flexibility.',
    tipsUk: 'Коліна йдуть над пальцями, але не завалюються всередину. Груди вгору. Глибина залежить від гнучкості.',
    warnings: 'Knee pain? Ensure proper form or reduce depth. Can modify with assistance or box squats.',
    warningsUk: 'Біль в колінах? Переконайтеся в правильній техніці або зменште глибину. Можна модифікувати з допомогою чи присідання на ящик.',
    imageUrl: 'https://images.unsplash.com/photo-1599447429685-80b5cbc03794?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    caloriesPerMin: 9
  },
  {
    name: 'Barbell Squat',
    nameUk: 'Присідання зі штангою',
    description: 'Weighted squat with barbell - king of leg exercises',
    descriptionUk: 'Присідання зі штангою - король вправ для ніг',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'barbell',
    difficulty: 'intermediate',
    location: 'gym',
    instructions: 'Bar on shoulders. Unrack and walk back. Squat to parallel or below. Drive up through heels.',
    instructionsUk: 'Штанга на плечах. Зніміть і відійдіть назад. Присядьте до паралелі або нижче. Піднімайтеся п\'ятами.',
    tips: 'High or low bar position both work. Low allows deeper squat. Keep core braced tightly.',
    tipsUk: 'Високе або низьке розміщення штанги працюють. Низьке дозволяє глибше присідати. Тримайте прес напруженим.',
    warnings: 'Use squat rack with safety pins! Start light. Knee wraps optional for support.',
    warningsUk: 'Використовуйте стійку для присідань зі страховочними брусками! Почніть з легкої ваги. Еластичні бинти за потреби для підтримки.',
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    caloriesPerMin: 8
  },
  {
    name: 'Lunges',
    nameUk: 'Випади',
    description: 'Unilateral leg exercise for strength and balance',
    descriptionUk: 'Одностороння вправа для ніг на силу та баланс',
    type: 'strength',
    muscleGroup: 'legs',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    location: 'home',
    instructions: 'Step forward into lunge position. Both knees at 90 degrees. Push back to start.',
    instructionsUk: 'Крок вперед у позицію випаду. Обидва коліна під кутом 90 градусів. Поверніться назад.',
    tips: 'Don\'t let front knee go past toes. Keep torso upright. Depth matters more than distance.',
    tipsUk: 'Не дозволяйте передньому коліну йти за пальці. Тримайте торс вертикально. Глибина важливіша за відстань.',
    warnings: 'Knee issues? Reduce range or do reverse lunges. Balance problems? Hold onto support.',
    warningsUk: 'Проблеми з колінами? Зменште діапазон або робіть зворотні випади. Проблеми з балансом? Тримайтеся за опору.',
    imageUrl: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    caloriesPerMin: 7
  },
  
  // ARMS EXERCISES
  {
    name: 'Bicep Curls',
    nameUk: 'Підйоми на біцепс',
    description: 'Dumbbell bicep isolation for arm development',
    descriptionUk: 'Ізоляція біцепсів з гантелями для розвитку рук',
    type: 'strength',
    muscleGroup: 'arms',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    location: 'gym',
    instructions: 'Stand or sit holding dumbbells. Curl to shoulders. Squeeze biceps hard. Lower slowly.',
    instructionsUk: 'Стоячи або сидячи, тримайте гантелі. Згинайте до плечей. Сильно стискайте біцепси. Повільно опускайте.',
    tips: 'No swinging or momentum. Isolate the bicep. Don\'t lift too heavy - form over ego.',
    tipsUk: 'Без розгойдування чи імпульсу. Ізолюйте біцепс. Не піднімайте занадто важко - техніка важливіша за его.',
    warnings: 'Elbow pain? Reduce weight. Don\'t hyperextend at bottom.',
    warningsUk: 'Біль у ліктях? Зменште вагу. Не перерозтягуйте внизу.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    caloriesPerMin: 5
  },
  {
    name: 'Tricep Dips',
    nameUk: 'Віджимання на брусах',
    description: 'Bodyweight tricep and shoulder exercise',
    descriptionUk: 'Вправа для трицепсів та плечей з власною вагою',
    type: 'strength',
    muscleGroup: 'arms',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    location: 'home',
    instructions: 'Dip body down between parallel bars. Lower until shoulders below elbows. Push up explosively.',
    instructionsUk: 'Опускайте тіло на брусах. Опускайтеся до рівня нижче ліктів. Виштовхуйтеся експлозивно.',
    tips: 'Slight forward lean targets triceps more. Don\'t go too deep if shoulder issues.',
    tipsUk: 'Невеликий нахил вперед більше навантажує трицепси. Не опускайтеся занадто глибоко при проблемах з плечами.',
    warnings: 'Shoulder pain? Modify or skip. Can do on bench for easier version.',
    warningsUk: 'Біль в плечах? Модифікуйте або пропустіть. Можна робити на лавці для легшої версії.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc',
    caloriesPerMin: 7
  },
  
  // SHOULDERS EXERCISES
  {
    name: 'Overhead Press',
    nameUk: 'Жим стоячи',
    description: 'Barbell shoulder press - powerful overhead movement',
    descriptionUk: 'Жим штанги над головою - потужний рух вгору',
    type: 'strength',
    muscleGroup: 'shoulders',
    equipment: 'barbell',
    difficulty: 'intermediate',
    location: 'gym',
    instructions: 'Press bar from shoulders to full overhead extension. Keep core tight. Lower control.',
    instructionsUk: 'Витискайте штангу з плечей до повної руки над головою. Тримайте прес напруженим. Опускайте контрольовано.',
    tips: 'Don\'t lean back excessively. Full range of motion. Brace hard before pressing.',
    tipsUk: 'Не відхиляйтесь занадто назад. Повний діапазон руху. Напружуйтесь перед витисканням.',
    warnings: 'Lower back issues? Use seated version. Start conservatively.',
    warningsUk: 'Проблеми з нижньою частиною спини? Використовуйте сидячу версію. Почніть консервативно.',
    imageUrl: 'https://images.unsplash.com/photo-1598974296123-a3dbaeed9d2e?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=F3QY5vMz_6I',
    caloriesPerMin: 7
  },
  {
    name: 'Lateral Raises',
    nameUk: 'Підйоми в сторони',
    description: 'Dumbbell shoulder isolation for width',
    descriptionUk: 'Ізоляція плечей з гантелями для ширини',
    type: 'strength',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
    difficulty: 'beginner',
    location: 'gym',
    instructions: 'Raise dumbbells out to sides to shoulder height. Lower slowly. Perfect form.',
    instructionsUk: 'Піднімайте гантелі в сторони до рівня плечей. Повільно опускайте. Відточена техніка.',
    tips: 'Don\'t raise past shoulders. Control is key. Light weight, perfect form.',
    tipsUk: 'Не піднімайте вище плечей. Контроль - ключ. Легка вага, відточена техніка.',
    warnings: 'Impulse work is useless here. Shoulder impingement? Avoid or modify.',
    warningsUk: 'Імпульсна робота марна тут. Ущемлення плеча? Уникайте або модифікуйте.',
    imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    caloriesPerMin: 5
  },
  
  // CORE EXERCISES
  {
    name: 'Plank',
    nameUk: 'Планка',
    description: 'Core strength isometric hold - stability builder',
    descriptionUk: 'Ізометрична вправа для розвитку сили та стійкості кору',
    type: 'strength',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    location: 'home',
    instructions: 'Hold straight body position on forearms and toes. Don\'t let hips sag.',
    instructionsUk: 'Тримайте прямое тіло на передпліччях і пальцях ніг. Не дозволяйте стегнам опускатися.',
    tips: 'Start with 20-30 seconds. Build up gradually. Form over duration.',
    tipsUk: 'Почніть з 20-30 секунд. Нарощуйте поступово. Техніка важливіша за тривалість.',
    warnings: 'Lower back pain? Stop. Build core strength first with easier variations.',
    warningsUk: 'Біль в нижній частині спини? Зупиніться. Нарощуйте силу кору спочатку з легшими варіаціями.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    caloriesPerMin: 4
  },
  {
    name: 'Crunches',
    nameUk: 'Скручування',
    description: 'Abdominal muscle exercise for core development',
    descriptionUk: 'Вправа для м\'язів живота та розвитку кору',
    type: 'strength',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    difficulty: 'beginner',
    location: 'home',
    instructions: 'Lift shoulders off floor, crunch abs. Don\'t pull on neck. Controlled movement.',
    instructionsUk: 'Піднімайте плечі з підлоги, скручуйте прес. Не тягніть за шию. Контрольований рух.',
    tips: 'Exhale on crunch. Neck neutral. Quality over quantity.',
    tipsUk: 'Видихайте при скручуванні. Шия нейтральна. Якість важливіша за кількість.',
    warnings: 'Neck pain? Support head lightly. Lower back issues? Consider alternatives.',
    warningsUk: 'Біль у шиї? Легко підтримуйте голову. Проблеми з нижньою частиною спини? Розгляньте альтернативи.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    caloriesPerMin: 6
  },
  
  // CARDIO EXERCISES
  {
    name: 'Running',
    nameUk: 'Біг',
    description: 'Cardiovascular endurance exercise - improves heart and lungs',
    descriptionUk: 'Кардіо вправа для витривалості - покращує серце та легені',
    type: 'cardio',
    muscleGroup: 'full_body',
    equipment: 'none',
    difficulty: 'beginner',
    location: 'outdoor',
    instructions: 'Start slow. Build pace gradually. Focus on breathing rhythm.',
    instructionsUk: 'Почніть повільно. Поступово збільшуйте темп. Фокус на ритмі дихання.',
    tips: 'Proper running shoes essential. Track your progress. Mix in walking if needed.',
    tipsUk: 'Якісне взуття для бігу обов\'язкове. Відстежуйте прогрес. Додавайте ходьбу за потреби.',
    warnings: 'Knee or joint issues? Consider elliptical or cycling. Start gradually.',
    warningsUk: 'Проблеми з колінами чи суглобами? Розгляньте еліптик або велосипед. Почніть поступово.',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=_kGESn8ArrU',
    caloriesPerMin: 10
  },
  {
    name: 'Jump Rope',
    nameUk: 'Стрибки на скакалці',
    description: 'High intensity cardio for full body conditioning',
    descriptionUk: 'Високоінтенсивне кардіо для тренування всього тіла',
    type: 'cardio',
    muscleGroup: 'full_body',
    equipment: 'none',
    difficulty: 'intermediate',
    location: 'home',
    instructions: 'Jump rope continuously. Keep a steady rhythm. Land on balls of feet.',
    instructionsUk: 'Стрибайте на скакалці безперервно. Тримайте стабільний ритм. Приземляйтеся на п\'ятах.',
    tips: 'Start with 30 second intervals. Build coordination first. Proper rope length is important.',
    tipsUk: 'Почніть з інтервалів по 30 секунд. Спочатку нарощуйте координацію. Важлива правильна довжина скакалки.',
    warnings: 'Knee or ankle issues? Low impact alternative recommended. Avoid on hard surfaces.',
    warningsUk: 'Проблеми з колінами чи щиколотками? Рекомендована альтернатива з низьким ударом. Уникайте твердих поверхонь.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=1BZM2Vre5oc',
    caloriesPerMin: 12
  },
  
  // FLEXIBILITY
  {
    name: 'Stretching',
    nameUk: 'Розтяжка',
    description: 'General flexibility routine - maintain mobility',
    descriptionUk: 'Загальна розтяжка - підтримка рухливості',
    type: 'flexibility',
    muscleGroup: 'full_body',
    equipment: 'none',
    difficulty: 'beginner',
    location: 'home',
    instructions: 'Hold stretches for 30 seconds. Breathe deeply. Don\'t bounce.',
    instructionsUk: 'Тримайте розтяжки по 30 секунд. Дихайте глибоко. Не стрибайте.',
    tips: 'Warm up first. Focus on major muscle groups. Consistency is key.',
    tipsUk: 'Спочатку розімніться. Фокус на основних групах м\'язів. Послідовність - ключ.',
    warnings: 'Never stretch cold muscles. Pain means stop. Different from soreness.',
    warningsUk: 'Ніколи не розтягуйте холодні м\'язи. Біль означає зупинку. Це відрізняється від біолі.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    videoUrl: 'https://www.youtube.com/watch?v=7NXWS3rL3Ck',
    caloriesPerMin: 2
  }
];

async function main() {
  console.log('🌱 Seeding extended exercises...');

  let created = 0;
  let updated = 0;

  // Seed exercises - update existing or create new
  for (const exercise of extendedExercises) {
    const existing = await prisma.exercise.findUnique({
      where: { name: exercise.name }
    });
    
    if (existing) {
      await prisma.exercise.update({
        where: { name: exercise.name },
        data: exercise
      });
      updated++;
    } else {
      await prisma.exercise.create({ data: exercise });
      created++;
    }
  }

  console.log(`✅ Updated ${updated} existing exercises`);
  console.log(`✅ Created ${created} new exercises`);
  console.log('💡 Exercise library now includes detailed instructions, tips, warnings, and media links!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

