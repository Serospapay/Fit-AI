# 💪 Кишеньковий тренер

**Освітній проект:** Персональний фітнес-додаток з AI-рекомендаціями

## 🚀 Швидкий старт

### 1. Клонувати репозиторій
```bash
git clone https://github.com/Serospapay/Fit-AI.git
cd Fit-AI/2
```

### 2. Запустити проект

**Windows:**
```bash
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

### 3. Налаштувати базу даних

1. Створити `.env` в `backend/` (скопіювати з `backend/.env.example`):
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness_trainer?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   ```

2. Опціонально: створити `frontend/.env.local` з `NEXT_PUBLIC_API_URL=http://localhost:5000` для production.

3. Запустити міграції та seed (створює користувача user@fitness.local / default-password):
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

### 4. Вхід

- Email: `user@fitness.local`
- Пароль: `default-password`

### 5. Відкрити браузер

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📱 Функціонал

### ✅ Реалізовано

- 🎨 Сучасний landing page з адаптацією
- 🔐 Система автентифікації (JWT)
- 📊 Dashboard зі статистикою та графіками
- 💪 База вправ з фільтрами (700+ вправ з Wger API)
- 📝 Щоденник тренувань з детальною статистикою
- 🍎 Щоденник харчування з автоматичним розрахунком БЖУ
- 🧮 Калькулятори (ІМТ, BMR, TDEE, WHR, макроелементи, пульс, вода)
- 🏆 Система досягнень (ачивки)
- 📈 Візуалізація прогресу через графіки
- 📄 Експорт даних (PDF/Excel) для тренувань та харчування

### ⏳ Опціонально (не реалізовано)

- 🏋️ Програми тренувань
- 🤖 AI-рекомендації (ML сервіс)
- 📱 PWA функціонал

## 🛠️ Технології

### Frontend
- Next.js 16, React 19, Bootstrap 5, TypeScript

### Backend
- Node.js, Express, Prisma, PostgreSQL, Winston

### ML Service (майбутнє)
- Python, FastAPI, Scikit-learn

## 📂 Структура

```
DPFah/2/
├── frontend/       # Next.js додаток
├── backend/        # Express API
├── ml-service/     # Python ML (майбутнє)
└── docker-compose.yml
```

## 📖 Детальна інформація

- **`PLAN.md`** - Повний план розробки
- **`docs/STATUS.md`** - Поточний статус реалізації
- **`docs/changelog.md`** - Журнал змін
- **`docs/tasktracker.md`** - Відстеження задач
- **`docs/project.md`** - Документація архітектури проекту

## 🔍 Логування та моніторинг

Усі помилки та події логуються у файли в `backend/logs/`:
- `error.log` - тільки помилки
- `combined.log` - всі події
- `exceptions.log` - необроблені винятки
- `rejections.log` - необроблені проміси

Сервер автоматично:
- ✅ Коректно завершує роботу (graceful shutdown)
- ✅ Логує всі операції та помилки
- ✅ Helmet та rate limiting для безпеки

---

**Проект готовий до використання! 🎉**
