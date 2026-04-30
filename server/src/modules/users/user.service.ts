import bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository.ts';
import { UserRole, type CreateUserInput, type UpdateUserInput, type UserAttributes } from './user.model.ts';
import { sanitizeUser } from './utils/sanitize-user.ts';

export class UserService {
  private repository = new UserRepository();

  async create(userData: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.repository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role ?? UserRole.EMPLOYEE,
    });

    return sanitizeUser(user.toJSON() as UserAttributes);
  }

  async findAll() {
    const users = await this.repository.findAll();
    return users.map((user) => sanitizeUser(user.toJSON() as UserAttributes));
  }

  async findById(id: number) {
    const user = await this.repository.findById(id);
    return user ? sanitizeUser(user.toJSON() as UserAttributes) : null;
  }

  async update(id: number, updates: UpdateUserInput) {
    const safeUpdates: UpdateUserInput = {};

    if (updates.name !== undefined) {
      safeUpdates.name = updates.name;
    }

    if (updates.email !== undefined) {
      safeUpdates.email = updates.email;
    }

    if (updates.role !== undefined) {
      safeUpdates.role = updates.role;
    }

    const user = await this.repository.update(id, safeUpdates);
    return user ? sanitizeUser(user.toJSON() as UserAttributes) : null;
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}