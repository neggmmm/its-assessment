import type { Request, Response } from 'express';
import { AssignmentService } from './assignment.service.ts';
import { User } from '../users/user.model.ts';
import { Exam } from '../exams/exam.model.ts';

const service = new AssignmentService();

type AuthenticatedRequest = Request & { user: { id: number } };

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Unexpected error';
}

export async function assignExam(req: Request, res: Response) {
    try {
        const { examId, employeeId } = req.body;
        const user = await User.findByPk(employeeId);
        if (!user) {
            throw new Error('Employee not found');
        }
        const exam = await Exam.findByPk(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        const assignment = await service.assignExam(examId, employeeId);

        res.json(assignment);
    } catch (error) {
        console.error('Failed to assign exam:', error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
}
export async function getAllAssignments(req: Request, res: Response) {
    try {
        const assignments = await service.getAllAssignments();
        res.json(assignments);
    } catch (error) {
        console.error('Failed to fetch assignments:', error);
        res.status(500).json({ message: getErrorMessage(error) });
    }
}
export async function getMyAssignments(req: Request, res: Response) {
    try {
        const user = (req as AuthenticatedRequest).user;
        const assignments = await service.getEmployeeAssignments(user.id);
        res.json(assignments);
    } catch (error) {
        console.error('Failed to fetch assignments:', error);
        res.status(500).json({ message: getErrorMessage(error) });
    }
}

export async function getAssignmentById(req: Request, res: Response) {
    try {
        const assignment = await service.getAssignmentById(Number(req.params.id));
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json(assignment);
    } catch (error) {
        console.error('Failed to fetch assignment:', error);
        res.status(500).json({ message: getErrorMessage(error) });
    }
}

export async function updateAssignmentStatus(req: Request, res: Response) {
    try {
        const { status } = req.body;

        const result = await service.updateStatus(Number(req.params.id), status);

        res.json(result);
    } catch (error) {
        console.error('Failed to update assignment status:', error);
        res.status(400).json({ message: getErrorMessage(error) });
    }
}
