'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Exercise {
  id: string;
  name: string;
  nameUk?: string;
  type: string;
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    rating: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/exercises');
      const data = await res.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const addExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, {
      exerciseId: exercise.id,
      exercise: exercise,
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      rest: '',
      order: selectedExercises.length
    }]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const workout = {
        ...workoutData,
        exercises: selectedExercises.map((ex, idx) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weight: ex.weight ? parseFloat(ex.weight) : null,
          duration: ex.duration ? parseInt(ex.duration) : null,
          rest: ex.rest ? parseInt(ex.rest) : null,
          order: idx
        }))
      };

      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workout)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Помилка збереження тренування');
        return;
      }

      router.push('/workouts');
    } catch (err) {
      setError('Помилка підключення до сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">💪 Кишеньковий тренер</a>
          <div className="flex gap-4">
            <a href="/workouts" className="hover:text-green-600">← Назад</a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">➕ Новий тренування</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата
              </label>
              <input
                type="date"
                value={workoutData.date}
                onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тривалість (хв)
              </label>
              <input
                type="number"
                value={workoutData.duration}
                onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Оцінка (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={workoutData.rating}
                onChange={(e) => setWorkoutData({ ...workoutData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нотатки
            </label>
            <textarea
              value={workoutData.notes}
              onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Запишіть свої спостереження..."
            />
          </div>

          {/* Вибір вправ */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Вправи</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <select
                onChange={(e) => {
                  const exercise = exercises.find(ex => ex.id === e.target.value);
                  if (exercise) addExercise(exercise);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">+ Додати вправу</option>
                {exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.nameUk || ex.name} ({ex.type})
                  </option>
                ))}
              </select>
            </div>

            {selectedExercises.length > 0 && (
              <div className="space-y-4">
                {selectedExercises.map((ex, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {ex.exercise.nameUk || ex.exercise.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeExercise(idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <input
                        type="number"
                        placeholder="Підходи"
                        value={ex.sets}
                        onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Повторення"
                        value={ex.reps}
                        onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Вага (кг)"
                        value={ex.weight}
                        onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Відпочинок (с)"
                        value={ex.rest}
                        onChange={(e) => updateExercise(idx, 'rest', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Збереження...' : '💾 Зберегти тренування'}
            </button>
            <a
              href="/workouts"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Скасувати
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

