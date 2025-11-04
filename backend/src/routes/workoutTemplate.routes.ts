import { Router } from 'express';
import { createWorkoutTemplate, getUserTemplates, updateWorkoutTemplate, deleteWorkoutTemplate } from '../controllers/workoutTemplate.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createWorkoutTemplate);
router.get('/', authenticateToken, getUserTemplates);
router.put('/:id', authenticateToken, updateWorkoutTemplate);
router.delete('/:id', authenticateToken, deleteWorkoutTemplate);

export default router;

