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
        fetch('http://localhost:5000/api/workouts?limit=3', {
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
      <div className="min-h-screen">
        <nav className="border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-xl font-bold">Кишеньковий тренер</a>
              <div className="flex items-center gap-8">
                <a href="/exercises" className="text-sm hover:opacity-60">Вправи</a>
                <a href="/calculators" className="text-sm hover:opacity-60">Калькулятори</a>
                <a href="/login" className="text-sm hover:opacity-60">Вхід</a>
                <a href="/register" className="text-sm px-4 py-2 bg-black text-white hover:bg-gray-800">
                  Реєстрація
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="max-w-4xl">
            <h1 className="text-8xl font-bold mb-8 leading-none">
              Персональний<br/>
              фітнес-помічник
            </h1>
            <p className="text-2xl text-gray-600 mb-16 max-w-2xl">
              Відстежуйте тренування, аналізуйте прогрес та отримуйте персональні рекомендації
            </p>
            <div className="flex gap-4">
              <a href="/register" className="px-8 py-4 bg-black text-white hover:bg-gray-800 font-medium">
                Почати
              </a>
              <a href="/exercises" className="px-8 py-4 border border-black hover:bg-gray-50 font-medium">
                Переглянути вправи
              </a>
            </div>
          </div>

          <div className="mt-40 grid grid-cols-3 gap-16">
            <div>
              <h3 className="text-xl font-bold mb-4">Велика база вправ</h3>
              <p className="text-gray-600 leading-relaxed">
                Колекція вправ з детальними інструкціями та поясненнями
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Детальна статистика</h3>
              <p className="text-gray-600 leading-relaxed">
                Аналізуйте прогрес з візуалізацією та прогнозами
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">AI рекомендації</h3>
              <p className="text-gray-600 leading-relaxed">
                Персоналізовані програми під ваші цілі
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-xl font-bold">Кишеньковий тренер</a>
            <div className="flex items-center gap-8">
              <a href="/exercises" className="text-sm hover:opacity-60">Вправи</a>
              <a href="/workouts" className="text-sm hover:opacity-60">Тренування</a>
              <a href="/calculators" className="text-sm hover:opacity-60">Калькулятори</a>
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
              <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-black">
                Вийти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-12">Dashboard</h1>

        <div className="grid grid-cols-4 gap-6 mb-16">
          <a href="/workouts/new" className="p-8 border hover:border-black transition-colors">
            <div className="text-3xl font-bold mb-2">+</div>
            <div className="text-sm text-gray-600">Додати тренування</div>
          </a>
          <a href="/exercises" className="p-8 border hover:border-black transition-colors">
            <div className="text-3xl font-bold mb-2">Exercises</div>
            <div className="text-sm text-gray-600">База вправ</div>
          </a>
          <a href="/calculators" className="p-8 border hover:border-black transition-colors">
            <div className="text-3xl font-bold mb-2">Calc</div>
            <div className="text-sm text-gray-600">Калькулятори</div>
          </a>
          <div className="p-8 border">
            <div className="text-3xl font-bold mb-2">AI</div>
            <div className="text-sm text-gray-600">Рекомендації</div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-6 mb-16">
            <div className="p-8 border">
              <div className="text-4xl font-bold mb-2">{stats.totalWorkouts || 0}</div>
              <div className="text-sm text-gray-600">Тренувань</div>
            </div>
            <div className="p-8 border">
              <div className="text-4xl font-bold mb-2">{Math.round(stats.avgDuration || 0)}</div>
              <div className="text-sm text-gray-600">Хвилин</div>
            </div>
            <div className="p-8 border">
              <div className="text-4xl font-bold mb-2">{stats.avgRating?.toFixed(1) || '0'}</div>
              <div className="text-sm text-gray-600">Оцінка</div>
            </div>
            <div className="p-8 border">
              <div className="text-4xl font-bold mb-2">{stats.mostExercised?.length || 0}</div>
              <div className="text-sm text-gray-600">Вправ</div>
            </div>
          </div>
        )}

        {recentWorkouts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Останні тренування</h2>
              <a href="/workouts" className="text-sm hover:opacity-60">
                Дивитися всі →
              </a>
            </div>
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="p-8 border hover:border-black transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold mb-2">
                        {new Date(workout.date).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="flex items-center gap-6 text-gray-600">
                          <span>{workout.exercises.length} вправ</span>
                          {workout.duration && <span>{workout.duration} хв</span>}
                        </div>
                      )}
                    </div>
                    {workout.rating && (
                      <div className="text-xl font-bold">{workout.rating}/5</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !stats && (
          <div className="border p-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Вітаємо!</h2>
            <p className="text-xl text-gray-600 mb-10">Додайте перше тренування</p>
            <a href="/workouts/new" className="inline-block px-8 py-4 bg-black text-white hover:bg-gray-800 font-medium">
              Додати тренування
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
