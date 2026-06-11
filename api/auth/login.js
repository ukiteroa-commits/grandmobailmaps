import { comparePassword, generateToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { nickname, password } = req.body;
  
  if (!nickname || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  
  const { data: user, error } = await supabase
    .from('users')
    .select('id, nickname, password_hash')
    .eq('nickname', nickname)
    .single();
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const { data: serversData } = await supabase
    .from('user_servers')
    .select('server_id')
    .eq('user_id', user.id);
  
  const servers = serversData?.map(s => s.server_id) || [];
  
  const token = generateToken(user.id, user.nickname);
  
  return res.status(200).json({
    token,
    user: { id: user.id, nickname: user.nickname, servers }
  });
}