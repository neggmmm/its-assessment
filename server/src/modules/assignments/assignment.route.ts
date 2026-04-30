import { Router } from 'express';
import { getAllAssignments ,assignExam, getMyAssignments, getAssignmentById, updateAssignmentStatus } from './assignment.controller.ts';
import { ensureAuthenticated } from '../auth/auth.middleware.ts';

const router = Router();

router.post('/', ensureAuthenticated, assignExam);
router.get('/me', ensureAuthenticated, getMyAssignments);
router.get('/:id', ensureAuthenticated, getAssignmentById);
router.get('/', ensureAuthenticated, getAllAssignments);
router.patch('/:id/status', ensureAuthenticated, updateAssignmentStatus);

export default router;
