const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Exercises
  getExercises: async (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/exercises?${params}`);
    return res.json();
  },

  getExerciseOptions: async () => {
    const res = await fetch(`${API_URL}/exercises/options`);
    return res.json();
  },

  // Workouts
  getWorkouts: async (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/workouts?${params}`);
    return res.json();
  },

  createWorkout: async (data: any) => {
    const res = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteWorkout: async (id: string) => {
    const res = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  getWorkoutStats: async () => {
    const res = await fetch(`${API_URL}/workouts/stats`);
    return res.json();
  }
};
