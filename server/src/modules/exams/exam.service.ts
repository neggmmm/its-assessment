import { Exam } from './exam.model.ts';
import { Question } from './question.model.ts';

type CreateExamInput = {
  title: string;
  description: string;
  createdBy: number;
};

type UpdateExamInput = Partial<Pick<CreateExamInput, 'title' | 'description'>>;

export class ExamService {
  async createExam(input: CreateExamInput) {
    return Exam.create(input);
  }

  async findAllExams() {
    return Exam.findAll({
      include: [
        {
          model: Question,
          as: 'questions',
          through: { attributes: [] },
        },
      ],
    });
  }

  async findExamById(id: number) {
    return Exam.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'questions',
          through: { attributes: [] },
        },
      ],
    });
  }

  async updateExam(id: number, updates: UpdateExamInput) {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return null;
    }

    await exam.update(updates);
    return this.findExamById(id);
  }

  async deleteExam(id: number) {
    const deletedCount = await Exam.destroy({ where: { id } });
    return deletedCount > 0;
  }

async addQuestionsToExam(examId: number, questionIds: number[]) {
  const exam = await Exam.findByPk(examId);

  if (!exam) {
    throw new Error('Exam not found');
  }

  const uniqueQuestionIds = [...new Set(questionIds)];

  const questions = await Question.findAll({
    where: { id: uniqueQuestionIds },
  });

  if (questions.length !== uniqueQuestionIds.length) {
    throw new Error('One or more questions not found');
  }
    await (exam as any).setQuestions(questions);

  return this.findExamById(examId);
}
}
