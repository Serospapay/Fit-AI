# 💪 Кишеньковий тренер (Fitness Trainer App)

Мобільний веб-додаток для комплексного підходу до фітнесу, харчування та здорового способу життя з інтелектуальним підбором вправ та програм тренувань.

## 🛠 Технологічний стек

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + Prisma
- **ML Service:** Python + FastAPI + Scikit-learn
- **Database:** PostgreSQL

## 📁 Структура проекту

```
.
├── frontend/          # Next.js додаток
├── backend/           # Express API
├── ml-service/        # Python ML мікросервіс
└── database/          # Міграції та seed дані
```

## 🚀 Швидкий старт

### Передумови

- Node.js 20+ 
- Python 3.11+
- PostgreSQL 15+ (або Docker)

### Встановлення

1. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend:**
   ```bash
   cd backend
   npm install
   # Налаштуйте .env файл
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **ML Service:**
   ```bash
   cd ml-service
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

## 📖 Документація

- [PLAN.md](./PLAN.md) - Детальний план розробки
- [SETUP.md](./SETUP.md) - Інструкції з налаштування середовища

## 🔧 Налаштування

1. Скопіюйте `.env.example` у `.env` у папці `backend`
2. Налаштуйте `DATABASE_URL` для підключення до PostgreSQL
3. Встановіть `JWT_SECRET` для безпеки

## 📝 Розробка

Проект розробляється поетапно згідно з планом у `PLAN.md`.

---

**Статус:** 🚧 В розробці

