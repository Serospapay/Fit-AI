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
  }
};
