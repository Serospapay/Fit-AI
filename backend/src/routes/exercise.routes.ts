import { Router } from 'express';
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getFilterOptions
} from '../controllers/exercise.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/options', getFilterOptions);
router.get('/', getAllExercises);
router.get('/:id', getExerciseById);

// Protected routes (тільки для адмінів - поки без перевірки)
router.post('/', authenticateToken, createExercise);
router.put('/:id', authenticateToken, updateExercise);
router.delete('/:id', authenticateToken, deleteExercise);

export default router;

