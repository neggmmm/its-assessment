import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../configuration/db.config.ts';
import { Assignment } from '../assignments/assignment.model.ts';
import { Question } from '../questions/question.model.ts';

export class Submission extends Model {}

Submission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Assignment, key: 'id' },
      onDelete: 'CASCADE',
    },

    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Question, key: 'id' },
    },

    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Can store selected choice text or yes/partial/no',
    },

    evidence: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Base64 encoded image or file path',
    },
  },
  {
    sequelize,
    tableName: 'submissions',
    timestamps: true,
  }
);

// relations
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
Submission.belongsTo(Question, { foreignKey: 'questionId' });
