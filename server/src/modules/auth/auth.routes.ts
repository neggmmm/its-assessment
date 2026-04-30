import { Router } from 'express';
import type { Request, Response } from 'express';
import { config } from '../../configuration/config.ts';
import { ensureAuthenticated } from './auth.middleware.ts';
import { AuthService } from './auth.service.ts';
import { UserRole, type PublicUser } from '../users/user.model.ts';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await authService.register({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});


router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, token } = await authService.login(email, password);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: config.nodeEnv === 'production',
      maxAge: config.cookieMaxAge,
    });

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.nodeEnv === 'production',
  });
  res.status(204).send();
}
);

router.get('/me', ensureAuthenticated, (req: Request, res: Response) => {
  res.json((req as Request & { user: PublicUser }).user);
}
);

export default router;
