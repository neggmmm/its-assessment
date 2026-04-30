import { Exam } from './exam.model.ts';
import { Question } from './question.model.ts';

type UpdateQuestionInput = {
  text?: string;
};

export class QuestionService {
  async createQuestion(text: string, createdBy: number) {
    return Question.create({ text, createdBy });
  }

  async findAllQuestions() {
    return Question.findAll({
      include: [
        {
          model: Exam,
          as: 'exams',
          through: { attributes: [] },
        },
      ],
    });
  }

  async findQuestionById(id: number) {
    return Question.findByPk(id, {
      include: [
        {
          model: Exam,
          as: 'exams',
          through: { attributes: [] },
        },
      ],
    });
  }

  async updateQuestion(id: number, updates: UpdateQuestionInput) {
    const question = await Question.findByPk(id);
    if (!question) {
      return null;
    }

    await question.update(updates);
    return this.findQuestionById(id);
  }

  async deleteQuestion(id: number) {
    const deletedCount = await Question.destroy({ where: { id } });
    return deletedCount > 0;
  }
}
