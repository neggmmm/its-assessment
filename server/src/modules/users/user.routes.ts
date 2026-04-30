import { Router } from 'express';
import type { Request, Response } from 'express';
import { UserService } from './user.service.ts';
import { ensureAuthenticated, requireRole } from '../auth/auth.middleware.ts';
import { UserRole, isUserRole, type CreateUserInput, type UpdateUserInput } from './user.model.ts';

const router = Router();
const userService = new UserService();

router.use(ensureAuthenticated);

router.post('/', requireRole(UserRole.ADMIN, UserRole.HR), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || (role !== undefined && !isUserRole(role))) {
      return res.status(400).json({ message: 'Invalid user payload' });
    }

    const payload: CreateUserInput = { name, email, password };
    if (role !== undefined) {
      payload.role = role;
    }

    const user = await userService.create(payload);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user' });
  }
});

router.get('/', requireRole(UserRole.ADMIN, UserRole.HR), async (_req: Request, res: Response) => {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/:id', requireRole(UserRole.ADMIN, UserRole.HR), async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await userService.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.put('/:id', requireRole(UserRole.ADMIN), async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { name, email, role } = req.body;
    if (role !== undefined && !isUserRole(role)) {
      return res.status(400).json({ message: 'Invalid user payload' });
    }

    const updates: UpdateUserInput = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;

    const user = await userService.update(id, updates);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user' });
  }
});

router.delete('/:id', requireRole(UserRole.ADMIN), async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const deleted = await userService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
