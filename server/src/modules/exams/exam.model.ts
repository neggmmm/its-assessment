import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../configuration/db.config.ts';
import { User } from '../users/user.model.ts';

export class Exam extends Model {}

Exam.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    sequelize,
    tableName: 'exams',
    timestamps: true,
    updatedAt: false,
  }
);
