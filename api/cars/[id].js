import { getUserFromToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const user = await getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  const { data: car, error: fetchError } = await supabase
    .from('cars')
    .select('user_id')
    .eq('id', id)
    .single();
  
  if (fetchError || !car) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  
  if (car.user_id !== user.id) {
    return res.status(403).json({ error: 'Not yours' });
  }
  
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) return res.status(500).json({ error: 'Delete failed' });
  
  return res.status(200).json({ success: true });
}