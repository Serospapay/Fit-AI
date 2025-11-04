const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
interface ApiError {
  error: string;
  message?: string;
}

interface Exercise {
  id: string;
  name: string;
}

interface ExerciseResponse {
  exercises: Exercise[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface WorkoutStats {
  totalWorkouts: number;
  avgDuration: number;
  avgRating: number;
  weekWorkouts: number;
  monthWorkouts: number;
  workoutStreak: number;
  recentWorkouts: any[];
  achievements?: any[];
  weeklyChartData?: any[];
}

interface NutritionLog {
  id: string;
  date: string;
  mealType: string;
  items: any[];
  totals?: any;
}

interface NutritionResponse {
  logs: NutritionLog[];
  total: number;
}

interface NutritionStats {
  totalLogs: number;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  activityLevel: string | null;
  goal: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to handle API responses
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Exercises
  getExercises: async (filters?: Record<string, string>): Promise<ExerciseResponse> => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/exercises?${params}`);
    return handleResponse<ExerciseResponse>(res);
  },

  getExerciseOptions: async () => {
    const res = await fetch(`${API_URL}/exercises/options`);
    return handleResponse(res);
  },

  // Workouts
  getWorkouts: async (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/workouts?${params}`);
    return handleResponse(res);
  },

  createWorkout: async (data: any) => {
    const res = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteWorkout: async (id: string) => {
    const res = await fetch(`${API_URL}/workouts/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete workout');
    }
    return true;
  },

  getWorkoutStats: async (days?: number): Promise<WorkoutStats> => {
    const url = days ? `${API_URL}/workouts/stats?days=${days}` : `${API_URL}/workouts/stats`;
    const res = await fetch(url);
    return handleResponse<WorkoutStats>(res);
  },

  // Nutrition
  getNutritionLogs: async (filters?: Record<string, string>): Promise<NutritionResponse> => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/nutrition?${params}`);
    return handleResponse<NutritionResponse>(res);
  },

  createNutritionLog: async (data: any) => {
    const res = await fetch(`${API_URL}/nutrition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteNutritionLog: async (id: string) => {
    const res = await fetch(`${API_URL}/nutrition/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete nutrition log');
    }
    return true;
  },

  getNutritionStats: async (days?: number): Promise<NutritionStats> => {
    const url = days ? `${API_URL}/nutrition/stats?days=${days}` : `${API_URL}/nutrition/stats`;
    const res = await fetch(url);
    return handleResponse<NutritionStats>(res);
  },

  // Foods
  getFoods: async (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/foods?${params}`);
    return handleResponse(res);
  },

  getFoodOptions: async () => {
    const res = await fetch(`${API_URL}/foods/options`);
    return handleResponse(res);
  },

  // Auth / Profile
  getProfile: async (): Promise<ProfileData> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse<ProfileData>(res);
  },

  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse<ProfileData>(res);
  },

  // Quotes
  getRandomQuote: async () => {
    const res = await fetch(`${API_URL}/quotes/random`);
    return handleResponse(res);
  },

  // Goals
  getGoals: async (status?: string) => {
    const token = localStorage.getItem('token');
    const url = status ? `${API_URL}/goals?status=${status}` : `${API_URL}/goals`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  createGoal: async (data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  updateGoal: async (id: string, data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteGoal: async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete goal');
    }
    return true;
  },

  // Workout Templates
  getWorkoutTemplates: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/workout-templates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  createWorkoutTemplate: async (data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/workout-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  updateWorkoutTemplate: async (id: string, data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/workout-templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteWorkoutTemplate: async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/workout-templates/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete template');
    }
    return true;
  },

  // Reminders
  getReminders: async (enabled?: boolean) => {
    const token = localStorage.getItem('token');
    const url = enabled !== undefined ? `${API_URL}/reminders?enabled=${enabled}` : `${API_URL}/reminders`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  createReminder: async (data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  updateReminder: async (id: string, data: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteReminder: async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete reminder');
    }
    return true;
  },

  // Recommendations
  getRecommendations: async (isRead?: boolean, limit?: number) => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (isRead !== undefined) params.append('isRead', String(isRead));
    if (limit) params.append('limit', String(limit));
    const url = `${API_URL}/recommendations${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  getUnreadRecommendationsCount: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/recommendations/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  generateRecommendations: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/recommendations/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  markRecommendationAsRead: async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/recommendations/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(res);
  },

  deleteRecommendation: async (id: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/recommendations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const error: ApiError = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Failed to delete recommendation');
    }
    return true;
  }
};
