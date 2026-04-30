import { Assignment } from '../assignments/assignment.model.ts';
import { Exam } from '../exams/exam.model.ts';
import { Submission } from './submission.model.ts';

export class SubmissionService {

    async getAllSubmissions() {
        return Submission.findAll();
    }
   async submitAnswers(assignmentId: number, answers: any[]) {
  const assignment = await Assignment.findByPk(assignmentId, {
  include: [{ model: Exam, include: ['questions'] }],
}) as any;

  if (!assignment) throw new Error('Assignment not found');

  const examQuestionIds = assignment?.Exam?.questions?.map(q => q.id) || [];

  const submissions = await Promise.all(
    answers.map((a) => {
      if (!examQuestionIds.includes(a.questionId)) {
        throw new Error(`Question ${a.questionId} not in exam`);
      }

      return Submission.create({
        assignmentId,
        questionId: a.questionId,
        answer: a.answer,
        evidence: a.evidence || null,
      });
    })
  );

  // Update assignment status to submitted
  await assignment.update({ status: 'submitted' });

  return submissions;
}

    async getSubmissions(assignmentId: number) {
        return Submission.findAll({
            where: { assignmentId },
        });
    }
}
