import { Router } from 'express';
import { createGoal, getUserGoals, updateGoal, deleteGoal } from '../controllers/goal.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createGoal);
router.get('/', authenticateToken, getUserGoals);
router.put('/:id', authenticateToken, updateGoal);
router.delete('/:id', authenticateToken, deleteGoal);

export default router;

