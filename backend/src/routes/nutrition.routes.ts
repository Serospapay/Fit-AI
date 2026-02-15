import { Router } from 'express';
import {
  createNutritionLog,
  getUserNutritionLogs,
  getNutritionLogById,
  getNutritionStats,
  updateNutritionLog,
  deleteNutritionLog
} from '../controllers/nutrition.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All nutrition routes require authentication
router.use(authenticateToken);

router.post('/', createNutritionLog);
router.get('/', getUserNutritionLogs);
router.get('/stats', getNutritionStats);
router.get('/:id', getNutritionLogById);
router.put('/:id', updateNutritionLog);
router.delete('/:id', deleteNutritionLog);

export default router;

