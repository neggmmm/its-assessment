import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { config } from '../../configuration/config.ts';
import { UserRepository } from '../user/user.repository.ts';
import { sanitizeUser } from '../user/utils/sanitize-user.ts';
import { UserRole, type PublicUser } from '../user/user.model.ts';

const userRepository = new UserRepository();
export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[config.cookieName];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { id: number };
    const user = await userRepository.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    (req as Request & { user: PublicUser }).user = sanitizeUser(user.toJSON());
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as Request & { user: PublicUser }).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}
