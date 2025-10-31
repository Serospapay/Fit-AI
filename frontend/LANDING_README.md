# 💪 Кишеньковий тренер - Сучасний Landing Page

## 🎨 Опис

Сучасний, адаптивний landing page для освітнього фітнес-додатку "Кишеньковий тренер", створений з використанням **Next.js 16**, **React 19**, **Bootstrap 5** та **Bootstrap Icons**.

## ✨ Особливості

### 🚀 Технології
- **Next.js 16** - React фреймворк з Server Components
- **React 19** - Найновіша версія React з оптимізованим рендерингом
- **Bootstrap 5** - Потужний CSS фреймворк для responsive дизайну
- **Bootstrap Icons** - Безкоштовна колекція іконок
- **TypeScript** - Статична типізація для безпеки коду

### 📱 Адаптивність
- **Mobile-First** дизайн
- **Breakpoints**: 
  - sm: 576px
  - md: 768px
  - lg: 992px
  - xl: 1200px
- Повна підтримка всіх сучасних пристроїв
- Touch-оптимізований інтерфейс

### 🎯 Секції Landing Page

1. **Hero Section** - Вражаючий заголовок з CTA
2. **Features** - 6 ключових можливостей
3. **How It Works** - 3-кроковий процес
4. **Testimonials** - Відгуки користувачів
5. **Pricing** - 3 тарифні плани
6. **CTA Section** - Фінальний заклик до дії
7. **Footer** - Навігація та контакти

### 🎨 Дизайн-система

#### Кольори
- **Primary**: `#6366f1` (Indigo)
- **Primary Dark**: `#4f46e5`
- **Secondary**: `#ec4899` (Pink)
- **Accent**: `#f59e0b` (Amber)
- **Dark**: `#1e293b` (Slate)
- **Light**: `#f8fafc` (Gray)

#### Анімації
- `fadeInUp` - поява з низу вверх
- `pulse` - пульсуючий ефект
- `smooth scroll` - плавна прокрутка
- Hover-ефекти на інтерактивних елементах

## 🛠️ Встановлення

### Передумови
- Node.js 18+ 
- npm або yarn

### Крок 1: Клонування репозиторію
```bash
cd frontend
```

### Крок 2: Встановлення залежностей
```bash
npm install
```

### Крок 3: Запуск dev-сервера
```bash
npm run dev
```

### Крок 4: Відкрити в браузері
```
http://localhost:3000
```

## 📦 Структура проекту

```
frontend/
├── app/
│   ├── components/
│   │   └── BootstrapClient.tsx    # Bootstrap JS ініціалізація
│   ├── globals.css                 # Глобальні стилі та кастомні CSS
│   ├── layout.tsx                  # Root layout з metadata
│   └── page.tsx                    # Головний landing page
├── public/                         # Статичні файли
├── node_modules/                   # Залежності
├── package.json                    # Залежності та скрипти
└── tsconfig.json                   # TypeScript конфігурація
```

## 🎭 Компоненти

### Navigation (Navbar)
- Фіксована навігація з прозорим фоном
- Автоматична зміна стилю при скролі
- Responsive мобільне меню
- Smooth scroll до секцій

### Hero Section
- Gradient фон з декоративними елементами
- Адаптивний текст (clamp)
- Дві CTA кнопки
- Зображення з Unsplash

### Features Grid
- 3-колонкова сітка на desktop
- 1 колонка на mobile
- Іконки Bootstrap Icons
- Однакова висота карток

### Pricing Cards
- 3 тарифи: Free, Pro, Premium
- "Популярно" badge на Pro
- Responsive grid
- Outline vs Solid кнопки

## 🔧 Кастомізація

### Зміна кольорів
Відредагуйте `globals.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  /* ... інші кольори */
}
```

### Додавання секцій
Скопіюйте структуру секцій з `page.tsx` та модифікуйте контент.

### Зміна типографіки
Оновіть `Inter` font в `layout.tsx` на будь-який Google Font.

## 📊 Performance

- **Next.js оптимізації**:
  - Автоматичний code splitting
  - Image optimization
  - Font optimization
  - Static generation де можливо

- **Bootstrap оптимізації**:
  - Мінімізований CSS/JS
  - Дерево рендерингу оптимізоване

## 🌐 Browser Support

- ✅ Chrome (останні 2 версії)
- ✅ Firefox (останні 2 версії)
- ✅ Safari (останні 2 версії)
- ✅ Edge (останні 2 версії)
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (Android 10+)

## 📝 Скрипти

```bash
npm run dev      # Запуск dev-сервера
npm run build    # Production збірка
npm run start    # Запуск production сервера
npm run lint     # Перевірка коду
```

## 🚀 Deployment

### Vercel (Рекомендовано)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Завантажити .next folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📄 Ліцензія

MIT License - використовуйте вільно!

## 🤝 Внесок

Вітаються PR та Issues! Будь ласка, дотримуйтесь стандартів коду проекту.

## 📧 Контакти

- **Email**: support@fitguide.com
- **Website**: https://fitguide.com

---

Створено з ❤️ використовуючи Next.js та Bootstrap

