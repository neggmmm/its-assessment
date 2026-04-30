import type { Request, Response } from 'express';
import { SubmissionService } from './subbmission.service.ts';

const service = new SubmissionService();

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}

export async function getAllSubmissions(req: Request, res: Response) {
    try {
        const submissions = await service.getAllSubmissions();
        res.json(submissions);
    } catch (error) {
        console.error('Failed to fetch submissions:', error);
        res.status(500).json({ message: getErrorMessage(error) });
    }
}
export async function submitAnswers(req : Request, res: Response) {
  try {
    const { assignmentId, answers } = req.body;

    const result = await service.submitAnswers(assignmentId, answers);

    res.json(result);
  } catch (error) {
    console.error('Failed to submit answers:', error);
    res.status(400).json({ message: getErrorMessage(error) });
  }
}

export async function getSubmissions(req:Request, res:Response) {
  try {
    const assignmentId = Number(req.params.assignmentId);

    const result = await service.getSubmissions(assignmentId);

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    res.status(500).json({ message: getErrorMessage(error) });
  }
}
