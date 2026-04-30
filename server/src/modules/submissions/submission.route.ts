import { Router } from 'express';
import {
    getAllSubmissions,
  submitAnswers,
  getSubmissions,
} from './submission.controller.ts';
import { ensureAuthenticated } from '../auth/auth.middleware.ts';

const router = Router();
router.get('/', ensureAuthenticated, getAllSubmissions);
router.post('/', ensureAuthenticated, submitAnswers);
router.get('/:assignmentId', ensureAuthenticated, getSubmissions);

export default router;
