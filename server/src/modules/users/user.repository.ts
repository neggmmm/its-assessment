import { User, type UserAttributes, type UserCreationAttributes } from './user.model.ts';

export class UserRepository {
  async create(userData: UserCreationAttributes) {
    return User.create(userData);
  }

  async findAll() {
    return User.findAll();
  }

  async findById(id: number) {
    return User.findByPk(id);
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async update(id: number, updates: Partial<UserAttributes>) {
    const [affectedRows] = await User.update(updates, { where: { id } });
    if (affectedRows === 0) return null;
    return User.findByPk(id);
  }

  async delete(id: number) {
    const affectedRows = await User.destroy({ where: { id } });
    return affectedRows > 0;
  }
}