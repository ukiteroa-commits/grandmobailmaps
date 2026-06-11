import { getUserFromToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { mine, server } = req.query;
    
    let query = supabase.from('cars').select('*').order('created_at', { ascending: false });
    
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
    
    const { server, title, price, plate, contact, image_url } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newCar = {
      user_id: user.id,
      nickname: user.nickname,
      server: server || '32',
      title,
      price: parseInt(price),
      plate: plate || null,
      contact: contact || '',
      image_url: image_url || null
    };
    
    const { data, error } = await supabase
      .from('cars')
      .insert(newCar)
      .select()
      .single();
    
    if (error) return res.status(500).json({ error: 'Failed to create' });
    return res.status(201).json(data);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}