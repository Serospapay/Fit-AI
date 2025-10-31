const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth
  register: async (data: { email: string; password: string; name?: string }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

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
  getWorkouts: async (token: string, filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/workouts?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  createWorkout: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteWorkout: async (token: string, id: string) => {
    const res = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.ok;
  },

  getWorkoutStats: async (token: string) => {
    const res = await fetch(`${API_URL}/workouts/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};

