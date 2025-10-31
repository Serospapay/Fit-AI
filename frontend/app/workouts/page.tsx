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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center w-full max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Необхідна автентифікація</h2>
          <p className="text-xl text-gray-600 mb-10">Увійдіть, щоб переглядати тренування</p>
          <a href="/login" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg hover:shadow-xl">
            Увійти
          </a>
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
              <a href="/" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Головна</a>
              <a href="/exercises" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Вправи</a>
              <a href="/workouts" className="text-sm text-gray-900 font-medium">Тренування</a>
              <a href="/calculators" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Калькулятори</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Мої тренування</h1>
            <p className="text-xl text-gray-600">Історія ваших тренувань</p>
          </div>
          <a
            href="/workouts/new"
            className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg hover:shadow-xl"
          >
            Додати тренування
          </a>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-xl text-gray-600">
            Завантаження тренувань...
          </div>
        ) : workouts.length === 0 ? (
          <div className="border-2 border-gray-200 rounded-2xl p-20 text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Немає тренувань</h2>
            <p className="text-xl text-gray-600 mb-10">Додайте перше тренування!</p>
            <a
              href="/workouts/new"
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg hover:shadow-xl"
            >
              Додати тренування
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {workouts.map((workout) => (
              <div key={workout.id} className="p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {new Date(workout.date).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="flex items-center gap-6 text-gray-600">
                      {workout.duration && (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {workout.duration} хв
                        </span>
                      )}
                      {workout.rating && (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {workout.rating}/5
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Вправи</h4>
                    <div className="space-y-3">
                      {workout.exercises.map((we, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <span className="font-semibold text-gray-900">
                            {we.exercise.nameUk || we.exercise.name}
                          </span>
                          <div className="flex items-center gap-4 text-gray-600">
                            {we.sets && we.reps && (
                              <span className="font-medium">{we.sets} x {we.reps}</span>
                            )}
                            {we.weight && (
                              <span className="font-medium">{we.weight}кг</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {workout.notes && (
                  <div className="text-gray-600 italic leading-relaxed">
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
