# 📡 API Endpoints

## Автентифікація

### POST /api/auth/register
Реєстрація нового користувача

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Іван Петренко"
}
```

**Response:**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Іван Петренко",
    "createdAt": "2025-10-31T..."
  },
  "token": "eyJhbGciOi..."
}
```

### POST /api/auth/login
Вхід користувача

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Іван Петренко",
    "createdAt": "2025-10-31T..."
  },
  "token": "eyJhbGciOi..."
}
```

### GET /api/auth/profile
Отримати профіль користувача (потрібен токен)

**Headers:**
```
Authorization: Bearer eyJhbGciOi...
```

**Response:**
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "name": "Іван Петренко",
  "age": 25,
  "gender": "male",
  "height": 180,
  "weight": 75,
  "activityLevel": "moderate",
  "goal": "gain_muscle",
  "createdAt": "2025-10-31T...",
  "updatedAt": "2025-10-31T..."
}
```

## Health Check

### GET /api/health
Перевірка роботи API

**Response:**
```json
{
  "status": "ok",
  "message": "Fitness Trainer API is running",
  "timestamp": "2025-10-31T..."
}
```

