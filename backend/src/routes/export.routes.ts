import { Router } from 'express';
import {
  exportWorkoutsExcel,
  exportWorkoutsPDF,
  exportNutritionExcel,
  exportNutritionPDF,
} from '../controllers/export.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/workouts/excel', authenticateToken, exportWorkoutsExcel);
router.get('/workouts/pdf', authenticateToken, exportWorkoutsPDF);
router.get('/nutrition/excel', authenticateToken, exportNutritionExcel);
router.get('/nutrition/pdf', authenticateToken, exportNutritionPDF);

export default router;

