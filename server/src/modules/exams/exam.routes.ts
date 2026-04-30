import { Router } from 'express';
import type { Request, Response } from 'express';
import { ensureAuthenticated, requireRole } from '../auth/auth.middleware.ts';
import { UserRole, type PublicUser } from '../users/user.model.ts';
import { ExamService } from './exam.service.ts';

const router = Router();
const examService = new ExamService();
const canWriteExams = requireRole(UserRole.ADMIN, UserRole.HR);

function parsePositiveId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.use(ensureAuthenticated);

router.post('/', canWriteExams, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || typeof title !== 'string' || !description || typeof description !== 'string') {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const user = (req as Request & { user: PublicUser }).user;
    const exam = await examService.createExam({ title, description, createdBy: user.id });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Failed to create exam:', error);
    res.status(400).json({ message: 'Failed to create exam' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const exams = await examService.findAllExams();
    res.json(exams);
  } catch (error) {
    console.error('Failed to fetch exams:', error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Invalid exam id' });
    }

    const exam = await examService.findExamById(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    console.error('Failed to fetch exam:', error);
    res.status(500).json({ message: 'Failed to fetch exam' });
  }
});

router.patch('/:id', canWriteExams, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Invalid exam id' });
    }

    const { title, description } = req.body;
    if (
      (title !== undefined && typeof title !== 'string') ||
      (description !== undefined && typeof description !== 'string')
    ) {
      return res.status(400).json({ message: 'Invalid exam payload' });
    }

    const exam = await examService.updateExam(id, { title, description });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    console.error('Failed to update exam:', error);
    res.status(400).json({ message: 'Failed to update exam' });
  }
});

router.delete('/:id', canWriteExams, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'Invalid exam id' });
    }

    const deleted = await examService.deleteExam(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete exam:', error);
    res.status(500).json({ message: 'Failed to delete exam' });
  }
});

router.post('/:examId/questions', canWriteExams, async (req, res) =>{
  try {
    const examId = Number(req.params.examId);
    const { questionIds } = req.body;

    const result = await examService.addQuestionsToExam(examId, questionIds);

    res.json(result);
  } catch (error) {
    console.error('Failed to add question to exam:', error);
    res.status(400).json({ message: "Failed to add question" });
  }
});

export default router;
