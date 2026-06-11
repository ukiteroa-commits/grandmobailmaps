import { getUserFromToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const user = await getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { servers } = req.body;
  
  if (!servers || !Array.isArray(servers) || servers.length === 0 || servers.length > 5) {
    return res.status(400).json({ error: 'Invalid servers list (1-5)' });
  }
  
  await supabase.from('user_servers').delete().eq('user_id', user.id);
  
  const serverRows = servers.map(serverId => ({
    user_id: user.id,
    server_id: serverId
  }));
  
  await supabase.from('user_servers').insert(serverRows);
  
  return res.status(200).json({ success: true, servers });
}