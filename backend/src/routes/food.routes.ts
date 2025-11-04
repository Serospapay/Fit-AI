import { Router } from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getFoodOptions
} from '../controllers/food.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/options', getFoodOptions);
router.get('/', getAllFoods);
router.get('/:id', getFoodById);

// Protected routes (for admins)
router.post('/', authenticateToken, createFood);
router.put('/:id', authenticateToken, updateFood);
router.delete('/:id', authenticateToken, deleteFood);

export default router;

