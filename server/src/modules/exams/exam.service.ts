import { Exam } from './exam.model';
import { Question } from './question.model';

export class ExamService {
  async createExam(data: any, userId: number) {
    return Exam.create({
      ...data,
      createdBy: userId,
    });
  }

  async createQuestion(data: any, userId: number) {
    return Question.create({
      ...data,
      createdBy: userId,
    });
  }

  async addQuestionsToExam(examId: number, questionIds: number[]) {
    const exam = await Exam.findByPk(examId);

    if (!exam) throw new Error('Exam not found');

    const questions = await Question.findAll({
      where: { id: questionIds },
    });

    await exam.$set('questions', questions);

    return exam;
  }

  async getExamById(id: number) {
    return Exam.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'questions',
        },
      ],
    });
  }
}