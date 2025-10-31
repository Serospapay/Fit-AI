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
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-gray-900">Кишеньковий тренер</a>
              <div className="flex items-center gap-8">
                <a href="/exercises" className="text-sm text-gray-700 hover:text-gray-900">Вправи</a>
                <a href="/calculators" className="text-sm text-gray-700 hover:text-gray-900">Калькулятори</a>
                <a href="/login" className="text-sm text-gray-700 hover:text-gray-900">Вхід</a>
                <a href="/register" className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Реєстрація
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Персональний фітнес<br/>помічник з AI
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Відстежуйте тренування, аналізуйте прогрес та отримуйте персональні рекомендації
              для досягнення ваших фітнес-цілей.
            </p>
            <div className="flex gap-4">
              <a href="/register" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Почати безкоштовно
              </a>
              <a href="/exercises" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium">
                Переглянути вправи
              </a>
            </div>
          </div>

          <div className="mt-32 grid grid-cols-3 gap-12">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Велика база вправ</h2>
              <p className="text-gray-600 leading-relaxed">
                Колекція вправ з детальними інструкціями та поясненнями для різних груп м'язів.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Детальна статистика</h2>
              <p className="text-gray-600 leading-relaxed">
                Аналізуйте прогрес з візуалізацією та отримуйте прогнози досягнення цілей.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">AI рекомендації</h2>
              <p className="text-gray-600 leading-relaxed">
                Персоналізовані програми тренувань під ваші цілі та можливості.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-gray-900">Кишеньковий тренер</a>
            <div className="flex items-center gap-8">
              <a href="/exercises" className="text-sm text-gray-700 hover:text-gray-900">Вправи</a>
              <a href="/workouts" className="text-sm text-gray-700 hover:text-gray-900">Тренування</a>
              <a href="/calculators" className="text-sm text-gray-700 hover:text-gray-900">Калькулятори</a>
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700">
                Вийти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Огляд вашої активності та прогресу</p>
        </div>

        {/* Швидкі дії */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <a href="/workouts/new" className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Додати тренування</h3>
                <p className="text-sm text-gray-600">Записати нову активність</p>
              </div>
            </div>
          </a>

          <a href="/exercises" className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">База вправ</h3>
                <p className="text-sm text-gray-600">Переглянути вправи</p>
              </div>
            </div>
          </a>

          <a href="/calculators" className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Калькулятори</h3>
                <p className="text-sm text-gray-600">BMR, TDEE, ІМТ</p>
              </div>
            </div>
          </a>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-12">
            <div className="p-6 border border-gray-200 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalWorkouts || 0}</div>
              <div className="text-sm text-gray-600">Тренувань за місяць</div>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(stats.avgDuration || 0)}</div>
              <div className="text-sm text-gray-600">Хвилин середня</div>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avgRating?.toFixed(1) || '0'}</div>
              <div className="text-sm text-gray-600">Середня оцінка</div>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.mostExercised?.length || 0}</div>
              <div className="text-sm text-gray-600">Унікальних вправ</div>
            </div>
          </div>
        )}

        {/* Останні тренування */}
        {recentWorkouts.length > 0 && (
          <div className="border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Останні тренування</h2>
              <a href="/workouts" className="text-sm text-gray-700 hover:text-gray-900">
                Всі тренування →
              </a>
            </div>
            <div className="divide-y divide-gray-200">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">
                        {new Date(workout.date).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{workout.exercises.length} {workout.exercises.length === 1 ? 'вправа' : 'вправ'}</span>
                          {workout.duration && <span>{workout.duration} хв</span>}
                        </div>
                      )}
                    </div>
                    {workout.rating && (
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {workout.rating}/5
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !stats && (
          <div className="border border-gray-200 rounded-xl p-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Вітаємо!</h2>
            <p className="text-gray-600 mb-8">Додайте перше тренування, щоб почати відстежувати прогрес</p>
            <a href="/workouts/new" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Додати тренування
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
