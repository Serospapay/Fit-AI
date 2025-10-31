import { Router } from 'express';
import {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} from '../controllers/workout.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/stats', getWorkoutStats);
router.post('/', createWorkout);
router.get('/', getUserWorkouts);
router.get('/:id', getWorkoutById);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;

