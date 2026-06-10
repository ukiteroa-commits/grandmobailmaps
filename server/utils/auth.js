import crypto from 'crypto';
import { readTable } from './db.js';

export const makeSalt = () => crypto.randomBytes(16).toString('hex');
export const hashPassword = (password, salt) =>
  crypto.scryptSync(String(password), salt, 32).toString('hex');
export const makeToken = () => crypto.randomBytes(24).toString('hex');

// Достаёт пользователя из заголовка Authorization: Bearer <token>
export async function getUserFromReq(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const users = await readTable('users');
  return users.find((u) => u.token === token) || null;
}

// Публичное представление пользователя (без пароля/токена)
export const publicUser = (u) => ({
  id: u.id,
  nickname: u.nickname,
  servers: u.servers || [],
  created_at: u.created_at,
});
