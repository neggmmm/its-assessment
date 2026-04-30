import { Exam } from './exam.model.ts';
import { ExamQuestion } from './exam-question.model.ts';
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
}
