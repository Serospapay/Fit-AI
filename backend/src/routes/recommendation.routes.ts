import { Router } from 'express';
import {
  getUserRecommendations,
  getUnreadCount,
  markAsRead,
  deleteRecommendation,
  generateRecommendations,
} from '../controllers/recommendation.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getUserRecommendations);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.post('/generate', authenticateToken, generateRecommendations);
router.put('/:id/read', authenticateToken, markAsRead);
router.delete('/:id', authenticateToken, deleteRecommendation);

export default router;

