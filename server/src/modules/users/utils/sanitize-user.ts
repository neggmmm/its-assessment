import { type PublicUser, type UserAttributes } from '../user.model.ts';

export function sanitizeUser(user: UserAttributes): PublicUser {
  const { password, ...safeUser } = user;
  return safeUser;
}
