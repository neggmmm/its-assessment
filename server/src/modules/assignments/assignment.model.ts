import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../configuration/db.config.ts';
import { Exam } from '../exams/exam.model.ts';
import { User } from '../users/user.model.ts';

export class Assignment extends Model {}

Assignment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Exam, key: 'id' },
      onDelete: 'CASCADE',
    },

    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },

    status: {
      type: DataTypes.ENUM('pending', 'submitted', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'assignments',
    timestamps: true,
  }
);

// relations
Assignment.belongsTo(Exam, { foreignKey: 'examId' });
Assignment.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });
