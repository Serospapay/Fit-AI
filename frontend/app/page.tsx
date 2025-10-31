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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-20 animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-xl opacity-50"></div>
              <h1 className="relative text-7xl font-extrabold bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                💪 Кишеньковий тренер
              </h1>
            </div>
          </div>
          <p className="text-2xl text-gray-700 mb-12 max-w-2xl mx-auto font-light">
            Ваш персональний фітнес-помічник з AI-рекомендаціями
          </p>
          <div className="flex justify-center gap-6">
            <a href="/exercises" className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <span className="relative z-10">🏋️ Переглянути вправи</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="/login" className="px-8 py-4 bg-white/80 backdrop-blur-lg text-gray-800 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200">
              🔐 Увійти
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in">
          <div className="glass-effect p-8 rounded-3xl card-hover">
            <div className="text-5xl mb-4 bg-gradient-to-br from-amber-400 to-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
              🏋️
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">База вправ</h2>
            <p className="text-gray-600 leading-relaxed">
              Велика колекція вправ з детальними інструкціями, поясненнями та рекомендаціями
            </p>
          </div>
          <div className="glass-effect p-8 rounded-3xl card-hover">
            <div className="text-5xl mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
              📊
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Статистика</h2>
            <p className="text-gray-600 leading-relaxed">
              Потужна аналітика прогресу з візуалізацією та прогнозами досягнення цілей
            </p>
          </div>
          <div className="glass-effect p-8 rounded-3xl card-hover">
            <div className="text-5xl mb-4 bg-gradient-to-br from-purple-400 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
              🤖
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">AI Рекомендації</h2>
            <p className="text-gray-600 leading-relaxed">
              Інтелектуальні персональні програми тренувань під ваші цілі та обмеження
            </p>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-center">
            🌟 Переваги платформи
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">Індивідуальний підхід</h3>
                <p className="text-gray-600">Програми адаптуються під ваш рівень та цілі</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">Професійний аналіз</h3>
                <p className="text-gray-600">Детальна статистика та прогноз прогресу</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">Зручна інтеграція</h3>
                <p className="text-gray-600">Одне місце для тренувань, харчування та відстеження</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-800">Мотивація та підтримка</h3>
                <p className="text-gray-600">Ачивки та рекомендації для постійного прогресу</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="glass-effect border-b border-white/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
            💪 Кишеньковий тренер
          </a>
          <div className="flex gap-6 items-center">
            <a href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Головна</a>
            <a href="/exercises" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Вправи</a>
            <a href="/workouts" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Тренування</a>
            <a href="/calculators" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Калькулятори</a>
            <span className="text-gray-600 font-medium">Привіт, {user.name || user.email}!</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors font-medium">
              Вийти
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3">
            📊 Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Огляд вашої активності та прогресу
          </p>
        </div>

        {/* Швидкі дії */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          <a
            href="/workouts/new"
            className="group relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white p-8 rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">➕</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Додати тренування</h3>
                <p className="opacity-90 text-sm">Записати нову активність</p>
              </div>
            </div>
          </a>

          <a
            href="/exercises"
            className="group relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">🏋️</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">База вправ</h3>
                <p className="opacity-90 text-sm">Переглянути вправи</p>
              </div>
            </div>
          </a>

          <a
            href="/calculators"
            className="group relative bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white p-8 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">🧮</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Калькулятори</h3>
                <p className="opacity-90 text-sm">BMR, TDEE, ІМТ</p>
              </div>
            </div>
          </a>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-12 animate-fade-in">
            <div className="glass-effect card-hover rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-2xl"></div>
              <div className="text-5xl mb-4 bg-gradient-to-br from-emerald-400 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10">📅</div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2 relative z-10">{stats.totalWorkouts || 0}</div>
              <div className="text-gray-600 font-medium relative z-10">Тренувань за місяць</div>
            </div>

            <div className="glass-effect card-hover rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl"></div>
              <div className="text-5xl mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10">⏱️</div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2 relative z-10">{Math.round(stats.avgDuration || 0)}</div>
              <div className="text-gray-600 font-medium relative z-10">Хвилин середня</div>
            </div>

            <div className="glass-effect card-hover rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-2xl"></div>
              <div className="text-5xl mb-4 bg-gradient-to-br from-amber-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10">⭐</div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2 relative z-10">{stats.avgRating?.toFixed(1) || '0'}</div>
              <div className="text-gray-600 font-medium relative z-10">Середня оцінка</div>
            </div>

            <div className="glass-effect card-hover rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-transparent rounded-full blur-2xl"></div>
              <div className="text-5xl mb-4 bg-gradient-to-br from-red-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl relative z-10">🔥</div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2 relative z-10">{stats.mostExercised?.length || 0}</div>
              <div className="text-gray-600 font-medium relative z-10">Унікальних вправ</div>
            </div>
          </div>
        )}

        {/* Останні тренування */}
        {recentWorkouts.length > 0 && (
          <div className="glass-effect card-hover rounded-3xl p-10 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Останні тренування
              </h2>
              <a href="/workouts" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                Всі тренування →
              </a>
            </div>
            <div className="space-y-4">
              {recentWorkouts.map((workout, idx) => (
                <div key={workout.id} className="bg-white/50 rounded-2xl p-6 border border-white/50 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg group" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {new Date(workout.date).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="flex items-center gap-6">
                          <p className="text-sm text-gray-600 font-medium">
                            {workout.exercises.length} {workout.exercises.length === 1 ? 'вправа' : 'вправ'}
                          </p>
                          {workout.duration && <span className="text-sm text-gray-600">⏱️ {workout.duration} хв</span>}
                        </div>
                      )}
                    </div>
                    {workout.rating && (
                      <div className="flex items-center gap-2 bg-gradient-to-br from-amber-100 to-orange-100 px-4 py-2 rounded-full">
                        <span className="text-2xl">⭐</span>
                        <span className="font-bold text-gray-900">{workout.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !stats && (
          <div className="glass-effect rounded-3xl p-16 text-center animate-fade-in">
            <div className="text-8xl mb-6 bg-gradient-to-br from-emerald-400 to-cyan-500 bg-clip-text text-transparent">🏁</div>
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Вітаємо!</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">Додайте перше тренування, щоб почати відстежувати прогрес</p>
            <a href="/workouts/new" className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all inline-block">
              Додати тренування
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
