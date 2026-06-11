import { hashPassword, generateToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { nickname, password, servers } = req.body;
  
  if (!nickname || !password || password.length < 4 || !servers?.length) {
    return res.status(400).json({ error: 'Invalid registration data' });
  }
  
  if (servers.length > 5) {
    return res.status(400).json({ error: 'Max 5 servers' });
  }
  
  const passwordHash = await hashPassword(password);
  
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({ nickname, password_hash: passwordHash })
    .select()
    .single();
  
  if (userError) {
    if (userError.code === '23505') {
      return res.status(400).json({ error: 'Nickname already exists' });
    }
    return res.status(500).json({ error: 'Registration failed' });
  }
  
  const serverRows = servers.map(serverId => ({
    user_id: user.id,
    server_id: serverId
  }));
  
  await supabase.from('user_servers').insert(serverRows);
  
  const token = generateToken(user.id, user.nickname);
  
  return res.status(201).json({
    token,
    user: { id: user.id, nickname: user.nickname, servers }
  });
}