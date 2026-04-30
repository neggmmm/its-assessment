import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../configuration/db.config.ts';
import { Exam } from './exam.model.ts';
import { Question } from '../questions/question.model.ts';

export class ExamQuestion extends Model {}

ExamQuestion.init(
  {
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Exam,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Question,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'exam_questions',
    timestamps: false,
  }
);

Exam.belongsToMany(Question, {
  through: ExamQuestion,
  foreignKey: 'examId',
  otherKey: 'questionId',
  as: 'questions',
});

Question.belongsToMany(Exam, {
  through: ExamQuestion,
  foreignKey: 'questionId',
  otherKey: 'examId',
  as: 'exams',
});
