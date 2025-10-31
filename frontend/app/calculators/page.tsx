'use client';

import { useState } from 'react';

export default function CalculatorsPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate'
  });
  const [results, setResults] = useState<any>(null);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const calculateBMR = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (!weight || !height || !age) return null;

    // Mifflin-St Jeor Formula
    const bmr = formData.gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    return Math.round(bmr);
  };

  const calculateTDEE = (bmr: number) => {
    const multiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];
    return Math.round(bmr * multiplier);
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (!weight || !height) return null;

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Нестача ваги';
    else if (bmi < 25) category = 'Норма';
    else if (bmi < 30) category = 'Надмірна вага';
    else category = 'Ожиріння';

    return { value: bmi.toFixed(1), category };
  };

  const handleCalculate = () => {
    const bmr = calculateBMR();
    const bmi = calculateBMI();
    
    if (!bmr || !bmi) {
      alert('Заповніть всі поля');
      return;
    }

    const tdee = calculateTDEE(bmr);

    setResults({ bmr, tdee, bmi });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">💪 Кишеньковий тренер</a>
          <div className="flex gap-4">
            <a href="/" className="hover:text-green-600">Головна</a>
            <a href="/exercises" className="hover:text-green-600">Вправи</a>
            <a href="/calculators" className="hover:text-green-600 font-semibold">Калькулятори</a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🧮 Калькулятори
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Фізіологічні показники</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вік (років)
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Стать
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="male">Чоловік</option>
                <option value="female">Жінка</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вага (кг)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зріст (см)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Рівень активності
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="sedentary">Сидячий (мало або без фізичних навантажень)</option>
                <option value="light">Легка активність (1-3 дні на тиждень)</option>
                <option value="moderate">Помірна активність (3-5 днів на тиждень)</option>
                <option value="active">Висока активність (6-7 днів на тиждень)</option>
                <option value="very_active">Дуже висока активність (2 рази на день)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
          >
            Розрахувати
          </button>
        </div>

        {results && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="text-lg font-semibold mb-2">BMR</h3>
              <p className="text-3xl font-bold">{results.bmr}</p>
              <p className="text-sm opacity-90 mt-1">ккал/день</p>
              <p className="text-xs mt-3 opacity-80">Базальний метаболізм</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold mb-2">TDEE</h3>
              <p className="text-3xl font-bold">{results.tdee}</p>
              <p className="text-sm opacity-90 mt-1">ккал/день</p>
              <p className="text-xs mt-3 opacity-80">Денні витрати енергії</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-2">ІМТ</h3>
              <p className="text-3xl font-bold">{results.bmi.value}</p>
              <p className="text-sm opacity-90 mt-1">{results.bmi.category}</p>
              <p className="text-xs mt-3 opacity-80">Індекс маси тіла</p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold mb-3">💡 Примітки:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><strong>BMR</strong> - це мінімальна кількість калорій, яка потрібна вашому організму для підтримки життєво важливих функцій в стані спокою.</li>
            <li><strong>TDEE</strong> - це загальна кількість калорій, які ви спалюєте за день, враховуючи вашу активність.</li>
            <li><strong>ІМТ</strong> - індекс маси тіла допомагає оцінити чи ваші вага та зріст знаходяться в здоровому діапазоні.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

