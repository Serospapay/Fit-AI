# 🖥️ Як переглянути проект

## 1. Backend API (вже запущено у фоні)

Сервер працює на: **http://localhost:5000**

### Endpoints:

**Health check:**
```
GET http://localhost:5000/api/health
```

**Вправи:**
```
GET http://localhost:5000/api/exercises
GET http://localhost:5000/api/exercises/options  # Фільтри
GET http://localhost:5000/api/exercises/:id
```

**Автентифікація:**
```
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/profile  # Потрібен токен
```

---

## 2. Prisma Studio (GUI для БД)

```bash
cd backend
npm run prisma:studio
```

Відкриється: **http://localhost:5555**

Перегляньте таблиці:
- exercises (20 вправ)
- users (якщо є користувачі)

---

## 3. Тестування API

### Через браузер:
Відкрийте:
- http://localhost:5000/api/health
- http://localhost:5000/api/exercises

### Через Postman/Thunder Client:
Імпортуйте endpoints з вище

### Через curl:
```bash
# Отримати всі вправи
curl http://localhost:5000/api/exercises

# Отримати опції фільтрів
curl http://localhost:5000/api/exercises/options

# Реєстрація
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

---

## 4. Frontend (ще не реалізовано)

Коли буде готовий:
```bash
cd frontend
npm run dev
```
Відкриється: **http://localhost:3000**

---

## 5. Структура файлів

```
backend/
├── src/
│   ├── controllers/     # Логіка
│   ├── routes/          # Маршрути
│   ├── middleware/      # JWT auth
│   ├── lib/             # Prisma
│   └── utils/           # Допомога
├── prisma/
│   ├── schema.prisma    # Схема БД
│   └── seed.ts          # Seed дані
└── .env                 # Налаштування
```

---

## 📊 Що вже працює:

✅ Backend API (20 вправ)  
✅ База даних (PostgreSQL)  
✅ Автентифікація (JWT)  
✅ CRUD для вправ  
⏳ Frontend (в розробці)  
⏳ Щоденник тренувань (в розробці)  

