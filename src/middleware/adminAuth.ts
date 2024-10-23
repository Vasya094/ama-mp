import { Response, NextFunction } from 'express';
import { UserRole } from '../models/User';
import { AuthRequest } from './auth';

const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
};

export default adminAuth;
