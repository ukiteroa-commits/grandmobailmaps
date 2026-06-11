import { getUserFromToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { mine, server } = req.query;
    
    let query = supabase.from('stocks').select('*').order('created_at', { ascending: false });
    
    if (mine === '1') {
      const user = await getUserFromToken(req);
      if (!user) return res.status(200).json([]);
      query = query.eq('user_id', user.id);
    } else if (server && server !== 'Все') {
      query = query.eq('server', server);
    }
    
    const { data, error } = await query;
    if (error) return res.status(500).json([]);
    return res.status(200).json(data || []);
  }
  
  if (req.method === 'POST') {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    const { server, business_name, price_per_share, stock_number, contact } = req.body;
    if (!business_name || !price_per_share) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newStock = {
      user_id: user.id,
      nickname: user.nickname,
      server: server || '32',
      business_name,
      price_per_share: parseInt(price_per_share),
      stock_number: stock_number || null,
      contact: contact || ''
    };
    
    const { data, error } = await supabase
      .from('stocks')
      .insert(newStock)
      .select()
      .single();
    
    if (error) return res.status(500).json({ error: 'Failed to create' });
    return res.status(201).json(data);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}