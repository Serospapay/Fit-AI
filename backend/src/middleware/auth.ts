import { Response, NextFunction } from 'express';
import { DEFAULT_USER_ID } from '../lib/config';
import { AuthRequest } from '../types';

// Simplified auth for single-user mode - just set default userId
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  req.userId = DEFAULT_USER_ID;
  next();
};
