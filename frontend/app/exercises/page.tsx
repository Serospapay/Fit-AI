'use client';

import { useState, useEffect } from 'react';

interface Exercise {
  id: string;
  name: string;
  nameUk?: string;
  description?: string;
  type: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty: string;
  caloriesPerMin?: number;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    muscleGroup: '',
    equipment: '',
    difficulty: '',
    search: ''
  });
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetchOptions();
    fetchExercises();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/exercises/options');
      const data = await res.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.muscleGroup) params.append('muscleGroup', filters.muscleGroup);
      if (filters.equipment) params.append('equipment', filters.equipment);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`http://localhost:5000/api/exercises?${params.toString()}`);
      const data = await res.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading && exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-2xl">Завантаження...</div>
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
            <a href="/exercises" className="hover:text-green-600 font-semibold">Вправи</a>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏋️ База вправ</h1>
          <p className="text-gray-600 mb-6">Виберіть вправи для свого тренування</p>
          
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Пошук..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Всі типи</option>
              {options?.types?.map((type: string) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.muscleGroup}
              onChange={(e) => handleFilterChange('muscleGroup', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Всі групи м'язів</option>
              {options?.muscleGroups?.map((group: string) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <select
              value={filters.equipment}
              onChange={(e) => handleFilterChange('equipment', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Всі пристрої</option>
              {options?.equipments?.map((eq: string) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Будь-який рівень</option>
              {options?.difficulties?.map((diff: string) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
              onClick={() => window.location.href = `/exercises/${exercise.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {exercise.nameUk || exercise.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{exercise.descriptionUk || exercise.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {exercise.type && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {exercise.type}
                  </span>
                )}
                {exercise.muscleGroup && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {exercise.muscleGroup}
                  </span>
                )}
                {exercise.equipment && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                    {exercise.equipment}
                  </span>
                )}
              </div>

              {exercise.caloriesPerMin && (
                <div className="text-sm text-gray-500">
                  🔥 {exercise.caloriesPerMin} ккал/хв
                </div>
              )}
            </div>
          ))}
        </div>

        {exercises.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Вправи не знайдено
          </div>
        )}
      </div>
    </div>
  );
}

