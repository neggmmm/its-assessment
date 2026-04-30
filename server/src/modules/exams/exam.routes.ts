import { Router } from 'express';
import type { Request, Response } from 'express';
import { ensureAuthenticated, requireRole } from '../auth/auth.middleware.ts';
import { UserRole, type PublicUser } from '../users/user.model.ts';
import { ExamService } from './exam.service.ts';
import { QuestionService } from './question.service.ts';

const router = Router();
const examService = new ExamService();
const questionService = new QuestionService();
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
    res.status(400).json({ message: 'Failed to create exam' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const exams = await examService.findAllExams();
    res.json(exams);
  } catch (error) {
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
    res.status(500).json({ message: 'Failed to fetch exam' });
  }
});

router.put('/:id', canWriteExams, async (req: Request<{ id: string }>, res: Response) => {
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
    res.status(500).json({ message: 'Failed to delete exam' });
  }
});

router.get('/questions', async (_req: Request, res: Response) => {
  try {
    const questions = await questionService.findAllQuestions();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

router.post('/questions', canWriteExams, async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Question text is required' });
    }

    const user = (req as Request & { user: PublicUser }).user;
    const question = await questionService.createQuestion(text, user.id);

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create question' });
  }
});

router.get('/questions/:id', async (req: Request<{ id: string }>, res: Response) => {
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
    res.status(500).json({ message: 'Failed to fetch question' });
  }
});

router.put('/questions/:id', canWriteExams, async (req: Request<{ id: string }>, res: Response) => {
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
    res.status(400).json({ message: 'Failed to update question' });
  }
});

router.delete('/questions/:id', canWriteExams, async (req: Request<{ id: string }>, res: Response) => {
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
    res.status(500).json({ message: 'Failed to delete question' });
  }
});

router.post('/:examId/questions', canWriteExams, async (req, res) =>{
  try {
    const examId = Number(req.params.examId);
    const { questionIds } = req.body;

    const result = await examService.addQuestionsToExam(examId, questionIds);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Failed to add question" });
  }
});

export default router;
