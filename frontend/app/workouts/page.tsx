'use client';

import { useState, useEffect } from 'react';

interface Workout {
  id: string;
  date: string;
  duration?: number;
  rating?: number;
  notes?: string;
  exercises: any[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage);
    if (tokenFromStorage) {
      fetchWorkouts(tokenFromStorage);
    }
  }, []);

  const fetchWorkouts = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/workouts', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (res.status === 401) {
        setError('Потрібна автентифікація');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      setWorkouts(data.workouts || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Помилка завантаження тренувань');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити це тренування?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setWorkouts(workouts.filter(w => w.id !== id));
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Необхідна автентифікація</h2>
          <p className="text-gray-600 mb-6">Увійдіть, щоб переглядати тренування</p>
          <a href="/login" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-block">
            Увійти
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">💪 Кишеньковий тренер</a>
          <div className="flex gap-4">
            <a href="/" className="hover:text-green-600">Головна</a>
            <a href="/exercises" className="hover:text-green-600">Вправи</a>
            <a href="/workouts" className="hover:text-green-600 font-semibold">Тренування</a>
            <a href="/calculators" className="hover:text-green-600">Калькулятори</a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📅 Мої тренування</h1>
          <a
            href="/workouts/new"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            + Додати тренування
          </a>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Завантаження тренувань...
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-2">Немає тренувань</h2>
            <p className="text-gray-600 mb-6">Додайте перше тренування!</p>
            <a
              href="/workouts/new"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-block"
            >
              Додати тренування
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {new Date(workout.date).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {workout.duration && (
                        <span>⏱️ {workout.duration} хв</span>
                      )}
                      {workout.rating && (
                        <span>⭐ {workout.rating}/5</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="text-red-600 hover:text-red-700 px-3 py-1"
                  >
                    🗑️
                  </button>
                </div>

                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Вправи:</h4>
                    <div className="space-y-2">
                      {workout.exercises.map((we, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-sm bg-gray-50 px-3 py-2 rounded">
                          <span className="font-medium text-gray-900">
                            {we.exercise.nameUk || we.exercise.name}
                          </span>
                          {we.sets && we.reps && (
                            <span className="text-gray-600">
                              {we.sets} x {we.reps}
                            </span>
                          )}
                          {we.weight && (
                            <span className="text-gray-600">{we.weight}кг</span>
                          )}
                          {we.duration && (
                            <span className="text-gray-600">{we.duration}с</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {workout.notes && (
                  <div className="text-sm text-gray-600 italic">
                    "{workout.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

