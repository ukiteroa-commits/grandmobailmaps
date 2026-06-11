import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) return res.status(500).json([]);
  return res.status(200).json(data || []);
}