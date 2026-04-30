import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../configuration/config.ts';
import { UserRole, type RegisterUserInput, type UserAttributes } from '../users/user.model.ts';
import { sanitizeUser } from '../users/utils/sanitize-user.ts';
import { UserRepository } from '../users/user.repository.ts';

const { sign, verify } = jwt;

export class AuthService {
  private repository = new UserRepository();

  async register(userData: RegisterUserInput) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.repository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    });

    return sanitizeUser(user.toJSON() as UserAttributes);
  }

  async login(email: string, password: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.getDataValue('password'));
    if (!isValid) throw new Error('Invalid credentials');

    const token = sign(
      { id: user.id, email: user.email, role: user.getDataValue('role') },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: sanitizeUser(user.toJSON() as UserAttributes),
      token,
    };
  }

  verifyToken(token: string) {
    return verify(token, config.jwtSecret) as {
      id: number;
      email: string;
      role: string;
    };
  }

  async getUserFromToken(token: string) {
    const payload = this.verifyToken(token);
    const user = await this.repository.findById(payload.id);

    return user ? sanitizeUser(user.toJSON() as UserAttributes) : null;
  }
}