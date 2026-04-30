import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../configuration/db.config.ts';
import { User } from '../users/user.model.ts';

export class Question extends Model {}

Question.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
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
    tableName: 'questions',
    timestamps: true,
    updatedAt: false,
  }
);
