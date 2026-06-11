import { getUserFromToken } from '../lib/auth.js';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  const { server, chat } = req.query;
  
  if (!server || !chat) {
    return res.status(400).json({ error: 'Missing server or chat' });
  }
  
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('server', server)
      .eq('chat', chat)
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (error) return res.status(500).json([]);
    return res.status(200).json(data || []);
  }
  
  if (req.method === 'POST') {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Message is empty' });
    }
    
    const newMessage = {
      server,
      chat,
      user_id: user.id,
      nickname: user.nickname,
      text: text.trim()
    };
    
    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();
    
    if (error) return res.status(500).json({ error: 'Failed to send' });
    return res.status(201).json(data);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}