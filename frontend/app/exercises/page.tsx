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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-gray-600">Завантаження...</div>
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
              <a href="/exercises" className="text-sm text-gray-900 font-medium">Вправи</a>
              <a href="/calculators" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">Калькулятори</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">База вправ</h1>
          <p className="text-xl text-gray-600 mb-12">Виберіть вправи для свого тренування</p>
          
          <div className="mb-8">
            <input
              type="text"
              placeholder="Пошук вправ..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="">Всі типи</option>
              {options?.types?.map((type: string) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.muscleGroup}
              onChange={(e) => handleFilterChange('muscleGroup', e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="">Всі групи м'язів</option>
              {options?.muscleGroups?.map((group: string) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <select
              value={filters.equipment}
              onChange={(e) => handleFilterChange('equipment', e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="">Всі пристрої</option>
              {options?.equipments?.map((eq: string) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            >
              <option value="">Будь-який рівень</option>
              {options?.difficulties?.map((diff: string) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => window.location.href = `/exercises/${exercise.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                  {exercise.nameUk || exercise.name}
                </h3>
                <span className={`px-4 py-1 rounded-lg text-sm font-semibold whitespace-nowrap ml-4 ${
                  exercise.difficulty === 'beginner' ? 'bg-green-50 text-green-700 border border-green-200' :
                  exercise.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{exercise.descriptionUk || exercise.description}</p>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {exercise.type && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                    {exercise.type}
                  </span>
                )}
                {exercise.muscleGroup && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                    {exercise.muscleGroup}
                  </span>
                )}
                {exercise.equipment && (
                  <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                    {exercise.equipment}
                  </span>
                )}
              </div>

              {exercise.caloriesPerMin && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span className="font-medium">{exercise.caloriesPerMin} ккал/хв</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {exercises.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500 text-xl">
            Вправи не знайдено
          </div>
        )}
      </div>
    </div>
  );
}
