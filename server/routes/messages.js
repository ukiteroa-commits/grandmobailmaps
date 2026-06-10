import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { readTable, writeTable } from '../utils/db.js';
import { getUserFromReq } from '../utils/auth.js';

const router = Router();
const MAX_PER_CHAT = 200;

// GET /api/messages?server=32&chat=general → последние сообщения чата
router.get('/', async (req, res, next) => {
  try {
    const { server, chat } = req.query;
    if (!server || !chat) return res.status(400).json({ error: 'server и chat обязательны' });
    const messages = await readTable('messages');
    const list = messages
      .filter((m) => m.server === String(server) && m.chat === String(chat))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-100);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// POST /api/messages { server, chat, text } — только для авторизованных
router.post('/', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Войдите, чтобы писать в чат' });

    const { server, chat, text } = req.body || {};
    const t = String(text || '').trim();
    if (!server || !chat || !t)
      return res.status(400).json({ error: 'server, chat, text — обязательные поля' });
    if (t.length > 500) return res.status(400).json({ error: 'Максимум 500 символов' });

    const msg = {
      id: uuid(),
      server: String(server),
      chat: String(chat),
      user_id: user.id,
      nickname: user.nickname,
      text: t,
      created_at: new Date().toISOString(),
    };

    let messages = await readTable('messages');
    messages.push(msg);

    // Ограничиваем историю каждого чата
    const key = (m) => `${m.server}::${m.chat}`;
    const counts = {};
    for (let i = messages.length - 1; i >= 0; i--) {
      const k = key(messages[i]);
      counts[k] = (counts[k] || 0) + 1;
      if (counts[k] > MAX_PER_CHAT) messages.splice(i, 1);
    }

    await writeTable('messages', messages);
    res.status(201).json(msg);
  } catch (e) {
    next(e);
  }
});

export default router;
