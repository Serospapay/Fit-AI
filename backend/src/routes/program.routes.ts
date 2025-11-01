import { Router } from 'express';
import {
  getAllPrograms,
  getProgramById,
  generateSmartProgram,
  createProgram,
  deleteProgram
} from '../controllers/program.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllPrograms);
router.get('/:id', getProgramById);

// Protected routes
router.post('/generate', authenticateToken, generateSmartProgram);
router.post('/', authenticateToken, createProgram);
router.delete('/:id', authenticateToken, deleteProgram);

export default router;

