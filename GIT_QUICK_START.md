# ⚡ Git - Швидкий старт

## ✅ Що вже зроблено:

1. ✅ Git встановлено (версія 2.51.2)
2. ✅ Git налаштовано (ім'я та email встановлені)
3. ✅ Репозиторій ініціалізовано
4. ✅ Перший commit зроблено (29 файлів збережено)

---

## 🎯 Основні команди (що вам потрібно знати):

### 1. Подивитися статус (що змінено)
```powershell
git status
```

### 2. Зберегти зміни (зробити commit)
```powershell
# Крок 1: Додати всі змінені файли
git add .

# Крок 2: Зробити commit з описом
git commit -m "Опис ваших змін"
```

**Приклад:**
```powershell
git add .
git commit -m "Додав нову функцію підбору вправ"
```

### 3. Подивитися історію змін
```powershell
git log --oneline
```

### 4. Подивитися що саме змінено
```powershell
git diff
```

---

## ⚙️ Як змінити ім'я та email (якщо потрібно):

```powershell
git config --global user.name "Ваше Справжнє Ім'я"
git config --global user.email "ваш.email@gmail.com"
```

**Приклад:**
```powershell
git config --global user.name "Іван Петренко"
git config --global user.email "ivan.petrenko@gmail.com"
```

---

## 📤 Як зберегти на GitHub (опціонально):

### Крок 1: Створіть репозиторій на GitHub
1. Зайдіть на https://github.com
2. Натисніть "New Repository"
3. Дайте назву (наприклад: "fitness-trainer")
4. НЕ ставте галочки "Initialize with README"
5. Натисніть "Create repository"

### Крок 2: Підключіть локальний репозиторій до GitHub
```powershell
git remote add origin https://github.com/ваш-username/fitness-trainer.git
git branch -M main
git push -u origin main
```

---

## 🔄 Що робити коли щось розробляєте:

1. **Працюєте над функцією:**
   ```powershell
   # Після змін у файлах
   git add .
   git commit -m "Додав нову функцію"
   ```

2. **Хочете подивитися що змінилось:**
   ```powershell
   git status
   git diff
   ```

3. **Хочете побачити всі збережені версії:**
   ```powershell
   git log --oneline
   ```

---

## 🆘 Якщо щось пішло не так:

### Відмінити останній commit (але залишити файли зміненими)
```powershell
git reset --soft HEAD~1
```

### Повернути файл до останньої версії
```powershell
git checkout -- назва-файлу
```

### Подивитися що було в останньому commit
```powershell
git show
```

---

## 💡 Поради:

1. **Робіть commit часто** - краще багато маленьких commit'ів, ніж один великий
2. **Пишіть зрозумілі повідомлення** - через місяць ви зрозумієте що змінювали
3. **Перевіряйте статус перед commit** - `git status` показує що буде збережено
4. **НЕ комітьте `.env` файли** - вони вже в `.gitignore`

---

## 📚 Більше інформації:

Детальніша інструкція у файлі `GIT_GUIDE.md`

---

**Ваш проект тепер під контролем версій! 🎉**

Всі зміни зберігаються історією, ви завжди можете повернутися до попередніх версій.

