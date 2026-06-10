import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { readTable, writeTable } from '../utils/db.js';
import { getUserFromReq } from '../utils/auth.js';

const router = Router();

// GET /api/trades?server=32&mine=1 (без server — все; mine=1 — только мои)
router.get('/', async (req, res, next) => {
  try {
    let trades = await readTable('trades');
    const { server, mine } = req.query;
    if (server) trades = trades.filter((t) => String(t.server) === String(server));
    if (mine) {
      const user = await getUserFromReq(req);
      if (!user) return res.status(401).json({ error: 'Не авторизован' });
      trades = trades.filter((t) => t.user_id === user.id);
    }
    trades.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(trades);
  } catch (e) {
    next(e);
  }
});

// POST /api/trades — только для авторизованных, никнейм берётся из аккаунта
router.post('/', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Войдите, чтобы подать объявление' });

    const { server, item, price, contact } = req.body || {};
    if (!server || !item || !price)
      return res.status(400).json({ error: 'server, item, price — обязательные поля' });

    const trade = {
      id: uuid(),
      user_id: user.id,
      server: String(server),
      nickname: user.nickname,
      item: String(item),
      price: String(price),
      contact: contact ? String(contact) : '',
      created_at: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    const trades = await readTable('trades');
    trades.push(trade);
    await writeTable('trades', trades);
    res.status(201).json(trade);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/trades/:id — удалить можно только своё объявление
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });

    const trades = await readTable('trades');
    const idx = trades.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Объявление не найдено' });
    if (trades[idx].user_id && trades[idx].user_id !== user.id)
      return res.status(403).json({ error: 'Можно удалять только свои объявления' });

    const [removed] = trades.splice(idx, 1);
    await writeTable('trades', trades);
    res.json({ ok: true, removed });
  } catch (e) {
    next(e);
  }
});

export default router;
