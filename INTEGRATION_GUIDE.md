# Інтеграція зовнішніх джерел для вправ та тренувань

## 🎯 Чому це краще?

**Поточний стан:**
- ❌ ~40 вправ вручну в базі
- ❌ Статичні дані
- ❌ Мало вправ
- ❌ Потрібен ручний ввід нових

**З інтеграцією:**
- ✅ 1000+ вправ автоматично
- ✅ Оновлення раз на день/тиждень
- ✅ Відео та фото
- ✅ Менше підтримки

---

## 📡 Рекомендовані джерела

### 1. **Wger.de (Рекомендований!)**
**Переваги:**
- ✅ Open Source
- ✅ RESTful API
- ✅ Офіційна документація
- ✅ Безкоштовно
- ✅ Користувацькі вправи

**API Endpoints:**
```
GET https://wger.de/api/v2/exercise/
GET https://wger.de/api/v2/exerciseinfo/
GET https://wger.de/api/v2/exerciseimage/
GET https://wger.de/api/v2/exercisecomment/
GET https://wger.de/api/v2/muscle/
GET https://wger.de/api/v2/exercisemuscle/
GET https://wger.de/api/v2/equipment/
```

**Приклад даних:**
```json
{
  "id": 345,
  "license_author": "wger.de",
  "name": "Barbell Bench Press",
  "category": "Chest",
  "muscles": ["Pectoralis major", "Anterior deltoid", "Triceps brachii"],
  "equipment": ["Barbell", "Bench"],
  "description": "The barbell bench press is one of the most popular exercises...",
  "comments": ["Keep your feet flat on the floor..."]
}
```

### 2. **ExerciseDB (RapidAPI)**
**Переваги:**
- ✅ 1300+ вправ
- ✅ Прості endpoint'и
- ⚠️ Потрібен API ключ (безкоштовний тейер)

**Endpoint:**
```
GET https://exercisedb.p.rapidapi.com/exercises
```

### 3. **MuscleWiki (Scraping)**
**Переваги:**
- ✅ Прості відео
- ✅ Наглядні інструкції
- ⚠️ Потрібен web scraper
- ⚠️ Потрібен puppeteer/cheerio

---

## 🚀 Впровадження (Wger)

### Крок 1: Створити service

```typescript
// backend/src/services/wger.service.ts
import axios from 'axios';
import logger from '../lib/logger';

const WGER_BASE_URL = 'https://wger.de/api/v2';
const PAGE_SIZE = 100;

export async function fetchExercisesFromWger() {
  try {
    const response = await axios.get(`${WGER_BASE_URL}/exercise/`, {
      params: { limit: PAGE_SIZE, offset: 0 }
    });
    
    return response.data.results;
  } catch (error) {
    logger.error('Error fetching from Wger:', error);
    throw error;
  }
}

export function mapWgerExerciseToDb(wgerExercise: any) {
  return {
    name: wgerExercise.name,
    nameUk: translateToUkrainian(wgerExercise.name),
    description: wgerExercise.description,
    descriptionUk: translateToUkrainian(wgerExercise.description),
    type: mapWgerCategoryToType(wgerExercise.category),
    muscleGroup: mapWgerMuscleGroup(wgerExercise.muscles),
    equipment: mapWgerEquipment(wgerExercise.equipment),
    difficulty: 'intermediate',
    location: 'gym',
    goal: mapExerciseGoal(wgerExercise.muscles),
    instructions: extractInstructions(wgerExercise.description),
    instructionsUk: translateToUkrainian(extractInstructions(wgerExercise.description)),
    tips: extractTips(wgerExercise.description),
    tipsUk: translateToUkrainian(extractTips(wgerExercise.description)),
    warnings: extractWarnings(wgerExercise.description),
    warningsUk: translateToUkrainian(extractWarnings(wgerExercise.description)),
    imageUrl: getImageUrl(wgerExercise.id),
    videoUrl: getVideoUrl(wgerExercise.id)
  };
}
```

### Крок 2: Синхронізація

```typescript
// backend/src/scripts/sync-exercises.ts
import { prisma } from '../lib/prisma';
import { fetchExercisesFromWger, mapWgerExerciseToDb } from '../services/wger.service';

async function syncExercises() {
  console.log('🔄 Starting exercise sync from Wger...');
  
  const wgerExercises = await fetchExercisesFromWger();
  let created = 0;
  let updated = 0;

  for (const wgerEx of wgerExercises) {
    const mapped = mapWgerExerciseToDb(wgerEx);
    
    const existing = await prisma.exercise.findUnique({
      where: { name: mapped.name }
    });

    if (existing) {
      await prisma.exercise.update({
        where: { id: existing.id },
        data: mapped
      });
      updated++;
    } else {
      await prisma.exercise.create({ data: mapped });
      created++;
    }
  }

  console.log(`✅ Sync complete: ${created} created, ${updated} updated`);
}

syncExercises()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### Крок 3: Cron job

```bash
# Додати в package.json
"scripts": {
  "sync-exercises": "ts-node backend/src/scripts/sync-exercises.ts"
}
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    # ...
  sync-scheduler:
    image: mcuadros/ofelia:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: daemon --docker
    labels:
      ofelia.job-run.exercise-sync.schedule: "@daily"
      ofelia.job-run.exercise-sync.command: "docker exec backend npm run sync-exercises"
```

---

## 🔄 Альтернатива: Власна база + інтеграція

**Hybrid approach** (найкращий баланс):

1. **Власна база** — базові вправи, вподобані користувачів
2. **Wger sync** — додавання нових вправ щодня
3. **Cache** — кешування популярних вправ
4. **Fallback** — якщо Wger недоступний, використовуємо свою базу

---

## ⚠️ Важливі моменти

### 1. **Rate Limiting**
```typescript
// Не робити багато запитів одночасно
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

for (const exercise of exercises) {
  await fetchDetails(exercise.id);
  await delay(1000); // 1 секунда між запитами
}
```

### 2. **Translation**
```typescript
// Використати Google Translate API або DeepL
async function translateToUkrainian(text: string): Promise<string> {
  // Або створити словник перекладів
  const dictionary = {
    'Chest': 'Груди',
    'Bench Press': 'Жим лежачи',
    // ...
  };
  return dictionary[text] || text;
}
```

### 3. **Error Handling**
```typescript
try {
  await syncExercises();
} catch (error) {
  logger.error('Sync failed:', error);
  // Fallback до локальної бази
}
```

---

## 🎬 План дій

**Фаза 1** (MVP):
- [ ] Інтегрувати Wger API
- [ ] Синхронізувати 100 топових вправ
- [ ] Додати переклади ключових термінів

**Фаза 2** (Продуктивність):
- [ ] Cron job для автоматичної синхронізації
- [ ] Кешування
- [ ] Офлайн режим

**Фаза 3** (Масштабування):
- [ ] Кілька джерел (ExerciseDB, MuscleWiki)
- [ ] ML для рекомендацій
- [ ] User-generated content

---

## 📚 Ресурси

- [Wger API Doc](https://wger.de/en/software/api)
- [ExerciseDB RapidAPI](https://rapidapi.com/apidash/api/exercisedb)
- [Open Source Fitness APIs](https://github.com/public-apis/public-apis#health)

---

**Висновок:** Так, інтеграція зовнішніх джерел значно краща за ручний ввід. Починайте з Wger - це найпростіше та найнадійніше рішення.

