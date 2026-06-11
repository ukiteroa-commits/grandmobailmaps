export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { nickname, password, servers } = req.body;
  
  // Просто возвращаем успех без БД
  return res.status(201).json({
    token: 'test-token',
    user: { id: 1, nickname, servers }
  });
}