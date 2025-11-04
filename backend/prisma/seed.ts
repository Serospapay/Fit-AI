import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_USER_ID } from '../src/lib/config';

const prisma = new PrismaClient();

const exercises: any[] = [
  // Грудні вправи
  { name: 'Віджимання від підлоги' },
  { name: 'Жим лежачи' },
  { name: 'Розведення гантелей' },
  { name: 'Віджимання на брусах' },
  
  // Вправи для спини
  { name: 'Підтягування' },
  { name: 'Підтягування зворотним хватом' },
  { name: 'Тяга штанги в нахилі' },
  { name: 'Тяга верхнього блоку' },
  { name: 'Тяга Т-штанги' },
  
  // Вправи для ніг
  { name: 'Присідання' },
  { name: 'Присідання зі штангою' },
  { name: 'Фронтальні присідання' },
  { name: 'Станова тяга' },
  { name: 'Румунська тяга' },
  { name: 'Випади' },
  { name: 'Жим ногами' },
  { name: 'Згинання ніг' },
  { name: 'Підйоми на носки' },
  
  // Вправи для рук
  { name: 'Підйоми на біцепс' },
  { name: 'Молотки' },
  { name: 'Віджимання на тріцепс' },
  { name: 'Жим лежачи вузьким хватом' },
  { name: 'Розгинання рук на блоці' },
  
  // Вправи для плечей
  { name: 'Жим сидячи/стоячи' },
  { name: 'Підйоми в сторони' },
  { name: 'Передні підйоми' },
  { name: 'Зворотні розведення' },
  { name: 'Тяга до підборіддя' },
  
  // Вправи для кору
  { name: 'Планка' },
  { name: 'Скручування' },
  { name: 'Підйоми корпусу' },
  { name: 'Російські скручування' },
  { name: 'Підйоми ніг' },
  { name: 'Альпініст' },
  
  // Кардіо вправи
  { name: 'Біг' },
  { name: 'Їзда на велосипеді' },
  { name: 'Стрибки на скакалці' },
  { name: 'Бурпі' },
  { name: 'Гребля' },
  
  // Вправи на гнучкість
  { name: 'Розтяжка' },
  { name: 'Йога' }
];

const foods: any[] = [
  // Мʼясо та птиця
  { name: 'Куряча грудка', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'meat' },
  { name: 'Яловичина', calories: 250, protein: 26, carbs: 0, fat: 17, category: 'meat' },
  { name: 'Свинина', calories: 242, protein: 27, carbs: 0, fat: 14, category: 'meat' },
  { name: 'Індичка', calories: 189, protein: 29, carbs: 0, fat: 7, category: 'meat' },
  { name: 'Риба (лосось)', calories: 208, protein: 20, carbs: 0, fat: 12, category: 'fish' },
  
  // Яйця та молочні
  { name: 'Яйце', calories: 155, protein: 13, carbs: 1.1, fat: 11, category: 'dairy' },
  { name: 'Молоко', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, category: 'dairy' },
  { name: 'Сир білий', calories: 98, protein: 11, carbs: 3.5, fat: 4.4, category: 'dairy' },
  { name: 'Йогурт', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, category: 'dairy' },
  { name: 'Творог', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, category: 'dairy' },
  
  // Крупи та зернові
  { name: 'Рис', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: 'grain' },
  { name: 'Гречка', calories: 343, protein: 13, carbs: 62, fat: 3.4, category: 'grain' },
  { name: 'Вівсянка', calories: 389, protein: 17, carbs: 66, fat: 7, category: 'grain' },
  { name: 'Макарони', calories: 131, protein: 5, carbs: 25, fat: 1.1, category: 'grain' },
  { name: 'Хліб', calories: 265, protein: 9, carbs: 49, fat: 3.2, category: 'grain' },
  
  // Овочі
  { name: 'Картопля', calories: 77, protein: 2, carbs: 17, fat: 0.1, category: 'vegetable' },
  { name: 'Броколі', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: 'vegetable' },
  { name: 'Морква', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, category: 'vegetable' },
  { name: 'Огірок', calories: 16, protein: 0.7, carbs: 4, fat: 0.1, category: 'vegetable' },
  { name: 'Помідор', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: 'vegetable' },
  { name: 'Капуста', calories: 25, protein: 1.3, carbs: 6, fat: 0.1, category: 'vegetable' },
  
  // Фрукти
  { name: 'Банан', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'fruit' },
  { name: 'Яблуко', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'fruit' },
  { name: 'Апельсин', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, category: 'fruit' },
  { name: 'Виноград', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, category: 'fruit' },
  { name: 'Ягоди', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, category: 'fruit' },
  
  // Горіхи та насіння
  { name: 'Горіхи волоські', calories: 654, protein: 15, carbs: 14, fat: 65, category: 'nuts' },
  { name: 'Мігдаль', calories: 579, protein: 21, carbs: 22, fat: 50, category: 'nuts' },
  { name: 'Насіння соняшника', calories: 584, protein: 21, carbs: 20, fat: 51, category: 'nuts' },
  
  // Жири та масло
  { name: 'Оливкова олія', calories: 884, protein: 0, carbs: 0, fat: 100, category: 'fats' },
  { name: 'Вершкове масло', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, category: 'fats' },
  
  // Напої
  { name: 'Вода', calories: 0, protein: 0, carbs: 0, fat: 0, category: 'beverages' },
  { name: 'Сік', calories: 45, protein: 0.5, carbs: 11, fat: 0.1, category: 'beverages' },
  { name: 'Кава', calories: 2, protein: 0.3, carbs: 0.2, fat: 0, category: 'beverages' },
  
  // Снеки
  { name: 'Шоколад', calories: 546, protein: 7.8, carbs: 54, fat: 31, category: 'snacks' },
  { name: 'Печиво', calories: 417, protein: 7, carbs: 75, fat: 9.5, category: 'snacks' }
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

  // Seed foods
  for (const food of foods) {
    const existing = await prisma.food.findFirst({
      where: { name: food.name }
    });
    
    if (!existing) {
      await prisma.food.create({ data: food });
    }
  }

  console.log(`✅ Seeded ${foods.length} foods`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

