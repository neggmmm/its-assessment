import { Router } from 'express';
import type { Request, Response } from 'express';
import { ensureAuthenticated, requireRole } from '../auth/auth.middleware.ts';
import { UserRole, type PublicUser } from '../users/user.model.ts';
import { QuestionService } from './question.service.ts';

const router = Router();
const questionService = new QuestionService();
const canWriteQuestions = requireRole(UserRole.ADMIN, UserRole.HR);

function parsePositiveId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.use(ensureAuthenticated);

router.get('/', async (_req: Request, res: Response) => {
  try {
    const questions = await questionService.findAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

router.post('/', canWriteQuestions, async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Question text is required' });
    }

    const user = (req as Request & { user: PublicUser }).user;
    const question = await questionService.createQuestion(text, user.id);

    res.status(201).json(question);
  } catch (error) {
    console.error('Failed to create question:', error);
    res.status(400).json({ message: 'Failed to create question' });
  }
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Invalid question id' });
    }

    const question = await questionService.findQuestionById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Failed to fetch question:', error);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
});

router.patch('/:id', canWriteQuestions, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Invalid question id' });
    }

    const { text } = req.body;
    if (text !== undefined && typeof text !== 'string') {
      return res.status(400).json({ message: 'Invalid question payload' });
    }

    const question = await questionService.updateQuestion(id, { text });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Failed to update question:', error);
    res.status(400).json({ message: 'Failed to update question' });
  }
});

router.delete('/:id', canWriteQuestions, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Invalid question id' });
    }

    const deleted = await questionService.deleteQuestion(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete question:', error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
});

export default router;
