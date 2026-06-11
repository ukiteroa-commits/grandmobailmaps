import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from './supabaseClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-me';

export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const generateToken = (userId, nickname) => {
  return jwt.sign({ userId, nickname }, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname')
    .eq('id', payload.userId)
    .single();
  
  if (error) return null;
  return data;
};