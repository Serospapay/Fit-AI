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
                <a href="/exercises" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Вправи</a>
                <a href="/calculators" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Калькулятори</a>
                <a href="/login" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Вхід</a>
                <a href="/register" className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Реєстрація
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
          <div className="max-w-4xl">
            <h1 className="text-7xl font-extrabold text-gray-900 mb-8 leading-none tracking-tight">
              Ваш персональний<br/>
              фітнес-помічник
            </h1>
            <p className="text-2xl text-gray-600 mb-16 leading-relaxed">
              Відстежуйте тренування, аналізуйте прогрес та отримуйте персональні рекомендації
            </p>
            <div className="flex gap-4 mb-32">
              <a href="/register" className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg hover:shadow-xl">
                Почати безкоштовно
              </a>
              <a href="/exercises" className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 transition-all font-semibold text-lg hover:shadow-lg">
                Переглянути вправи
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-16 max-w-5xl">
            <div>
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Велика база вправ</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Колекція вправ з детальними інструкціями та поясненнями
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Детальна статистика</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Аналізуйте прогрес з візуалізацією та прогнозами
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI рекомендації</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Персоналізовані програми під ваші цілі
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
              <a href="/exercises" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Вправи</a>
              <a href="/workouts" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Тренування</a>
              <a href="/calculators" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Калькулятори</a>
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 transition-colors">
                Вийти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Dashboard</h1>
          <p className="text-xl text-gray-600">Огляд вашої активності та прогресу</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-16">
          <a href="/workouts/new" className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Додати тренування</h3>
            <p className="text-gray-600">Записати нову активність</p>
          </a>

          <a href="/exercises" className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">База вправ</h3>
            <p className="text-gray-600">Переглянути всі вправи</p>
          </a>

          <a href="/calculators" className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Калькулятори</h3>
            <p className="text-gray-600">BMR, TDEE, ІМТ</p>
          </a>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalWorkouts || 0}</div>
              <div className="text-sm font-medium text-gray-600">Тренувань</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-2">{Math.round(stats.avgDuration || 0)}</div>
              <div className="text-sm font-medium text-gray-600">Хвилин</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.avgRating?.toFixed(1) || '0'}</div>
              <div className="text-sm font-medium text-gray-600">Оцінка</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.mostExercised?.length || 0}</div>
              <div className="text-sm font-medium text-gray-600">Вправ</div>
            </div>
          </div>
        )}

        {recentWorkouts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Останні тренування</h2>
              <a href="/workouts" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Дивитися всі →
              </a>
            </div>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        {new Date(workout.date).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="flex items-center gap-6 text-gray-600">
                          <span className="font-medium">{workout.exercises.length} вправ</span>
                          {workout.duration && <span className="font-medium">{workout.duration} хв</span>}
                        </div>
                      )}
                    </div>
                    {workout.rating && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xl font-bold">{workout.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !stats && (
          <div className="border-2 border-gray-200 rounded-2xl p-20 text-center">
            <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Вітаємо!</h2>
            <p className="text-xl text-gray-600 mb-10">Додайте перше тренування для відстеження прогресу</p>
            <a href="/workouts/new" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg hover:shadow-xl">
              Додати тренування
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
