import { Router } from 'express';
import { createReminder, getUserReminders, updateReminder, deleteReminder } from '../controllers/reminder.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createReminder);
router.get('/', authenticateToken, getUserReminders);
router.put('/:id', authenticateToken, updateReminder);
router.delete('/:id', authenticateToken, deleteReminder);

export default router;

