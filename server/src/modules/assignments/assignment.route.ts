import { Router } from 'express';
import { getAllAssignments ,assignExam, getMyAssignments, updateAssignmentStatus } from './assignment.controller.ts';
import { ensureAuthenticated } from '../auth/auth.middleware.ts';

const router = Router();

router.post('/', ensureAuthenticated, assignExam);
router.get('/me', ensureAuthenticated, getMyAssignments);
router.get('/', ensureAuthenticated, getAllAssignments);
router.patch('/:id/status', ensureAuthenticated, updateAssignmentStatus);

export default router;
