import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../../configuration/db.config.ts';

// Role enum
export const UserRole = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  HR: 'hr',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && Object.values(UserRole).includes(value as UserRole);
}

// Types
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export type PublicUser = Omit<UserAttributes, 'password'>;

export type RegisterUserInput = Pick<UserAttributes, 'name' | 'email' | 'password'>;

export type CreateUserInput = Pick<UserAttributes, 'name' | 'email' | 'password'> &
  Partial<Pick<UserAttributes, 'role'>>;

export type UpdateUserInput = Partial<Pick<UserAttributes, 'name' | 'email' | 'role'>>;

// Model class
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.EMPLOYEE,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);
