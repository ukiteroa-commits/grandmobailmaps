import { getUserFromToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  const user = await getUserFromToken(req);
  
  if (!user) {
    return res.status(401).json({ user: null });
  }
  
  const { data: serversData } = await supabase
    .from('user_servers')
    .select('server_id')
    .eq('user_id', user.id);
  
  const servers = serversData?.map(s => s.server_id) || [];
  
  return res.status(200).json({
    user: { ...user, servers }
  });
}