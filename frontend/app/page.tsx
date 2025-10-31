'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalWorkouts: number;
  avgDuration: number;
  avgRating: number;
  mostExercised: any[];
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr) {
      setUser(JSON.parse(userStr));
      if (token) {
        fetchDashboardData(token);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      const [statsRes, workoutsRes] = await Promise.all([
        fetch('http://localhost:5000/api/workouts/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/workouts?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (workoutsRes.ok) {
        const workoutsData = await workoutsRes.json();
        setRecentWorkouts(workoutsData.workouts || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-green-600">💪 Кишеньковий тренер</a>
            <div className="flex gap-4 items-center">
              <a href="/" className="hover:text-green-600">Головна</a>
              <a href="/exercises" className="hover:text-green-600">Вправи</a>
              <a href="/calculators" className="hover:text-green-600">Калькулятори</a>
              <a href="/login" className="hover:text-green-600">Вхід</a>
              <a href="/register" className="hover:text-green-600">Реєстрація</a>
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
              <a href="/exercises" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Вправи
              </a>
              <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Вхід
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">🏋️</div>
              <h2 className="text-xl font-semibold mb-2">База вправ</h2>
              <p className="text-gray-600">
                20+ вправ для різних груп м'язів з детальними інструкціями
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">💪 Кишеньковий тренер</a>
          <div className="flex gap-4 items-center">
            <a href="/" className="hover:text-green-600">Головна</a>
            <a href="/exercises" className="hover:text-green-600">Вправи</a>
            <a href="/workouts" className="hover:text-green-600">Тренування</a>
            <a href="/calculators" className="hover:text-green-600">Калькулятори</a>
            <span className="text-gray-600">Привіт, {user.name || user.email}!</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
              Вийти
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Dashboard
          </h1>
          <p className="text-gray-600">
            Огляд вашої активності та прогресу
          </p>
        </div>

        {/* Швидкі дії */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a
            href="/workouts/new"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-4"
          >
            <div className="text-5xl">➕</div>
            <div>
              <h3 className="text-xl font-bold">Додати тренування</h3>
              <p className="opacity-90 text-sm">Записати нову активність</p>
            </div>
          </a>

          <a
            href="/exercises"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-4"
          >
            <div className="text-5xl">🏋️</div>
            <div>
              <h3 className="text-xl font-bold">База вправ</h3>
              <p className="opacity-90 text-sm">Переглянути вправи</p>
            </div>
          </a>

          <a
            href="/calculators"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-4"
          >
            <div className="text-5xl">🧮</div>
            <div>
              <h3 className="text-xl font-bold">Калькулятори</h3>
              <p className="opacity-90 text-sm">BMR, TDEE, ІМТ</p>
            </div>
          </a>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalWorkouts || 0}</div>
              <div className="text-sm text-gray-600">Тренувань за місяць</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-3xl font-bold text-gray-900">{Math.round(stats.avgDuration || 0)}</div>
              <div className="text-sm text-gray-600">Середня тривалість (хв)</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgRating?.toFixed(1) || '0'}</div>
              <div className="text-sm text-gray-600">Середня оцінка</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-gray-900">{stats.mostExercised?.length || 0}</div>
              <div className="text-sm text-gray-600">Унікальних вправ</div>
            </div>
          </div>
        )}

        {/* Останні тренування */}
        {recentWorkouts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Останні тренування</h2>
              <a href="/workouts" className="text-green-600 hover:text-green-700 font-medium">
                Всі тренування →
              </a>
            </div>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {new Date(workout.date).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {workout.exercises.length} {workout.exercises.length === 1 ? 'вправа' : 'вправ'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm">
                      {workout.duration && <span className="text-gray-600">⏱️ {workout.duration} хв</span>}
                      {workout.rating && <span className="text-yellow-600">⭐ {workout.rating}/5</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !stats && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏁</div>
            <h2 className="text-2xl font-bold mb-2">Вітаємо!</h2>
            <p className="text-gray-600 mb-6">Додайте перше тренування, щоб почати відстежувати прогрес</p>
            <a href="/workouts/new" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-block">
              Додати тренування
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
