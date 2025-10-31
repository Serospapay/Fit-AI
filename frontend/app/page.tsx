'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">💪 Кишеньковий тренер</h1>
          <div className="flex gap-4">
            <a href="/" className="hover:text-green-600">Головна</a>
            <a href="/exercises" className="hover:text-green-600">Вправи</a>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            💪 Кишеньковий тренер
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ваш персональний фітнес-помічник з AI
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/exercises"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Вправи
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Вхід
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">🏋️</div>
            <h2 className="text-xl font-semibold mb-2">База вправ</h2>
            <p className="text-gray-600">
              100+ вправ для різних груп м'язів з детальними інструкціями
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">📊</div>
            <h2 className="text-xl font-semibold mb-2">Статистика</h2>
            <p className="text-gray-600">
              Відстежуйте прогрес та досягнення у реальному часі
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-3">🤖</div>
            <h2 className="text-xl font-semibold mb-2">AI Рекомендації</h2>
            <p className="text-gray-600">
              Персоналізовані програми тренувань
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Статус проекту</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <span>Backend API готовий (20 вправ)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <span>База даних налаштована</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <span>Автентифікація працює</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-500 text-xl">⏳</span>
              <span>Frontend в розробці</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
