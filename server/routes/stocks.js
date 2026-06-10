import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { readTable, writeTable } from '../utils/db.js';
import { getUserFromReq } from '../utils/auth.js';

const router = Router();

// GET /api/stocks?server=32&mine=1
router.get('/', async (req, res, next) => {
  try {
    let stocks = await readTable('stocks');
    const { server, mine } = req.query;
    if (server) stocks = stocks.filter((s) => String(s.server) === String(server));
    if (mine) {
      const user = await getUserFromReq(req);
      if (!user) return res.status(401).json({ error: 'Не авторизован' });
      stocks = stocks.filter((s) => s.user_id === user.id);
    }
    stocks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(stocks);
  } catch (e) {
    next(e);
  }
});

// POST /api/stocks — только для авторизованных
router.post('/', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Войдите, чтобы подать объявление' });

    const { server, business_name, stock_number, price_per_share, contact } = req.body || {};
    if (!server || !business_name || !price_per_share || !contact) {
      return res
        .status(400)
        .json({ error: 'server, business_name, price_per_share, contact — обязательные поля' });
    }
    const stock = {
      id: uuid(),
      user_id: user.id,
      server: String(server),
      business_name: String(business_name),
      stock_number: stock_number ? String(stock_number) : '',
      price_per_share: String(price_per_share),
      contact: String(contact),
      created_at: new Date().toISOString(),
    };
    const stocks = await readTable('stocks');
    stocks.push(stock);
    await writeTable('stocks', stocks);
    res.status(201).json(stock);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/stocks/:id — только своё
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });

    const stocks = await readTable('stocks');
    const idx = stocks.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Не найдено' });
    if (stocks[idx].user_id && stocks[idx].user_id !== user.id)
      return res.status(403).json({ error: 'Можно удалять только свои объявления' });

    const [removed] = stocks.splice(idx, 1);
    await writeTable('stocks', stocks);
    res.json({ ok: true, removed });
  } catch (e) {
    next(e);
  }
});

export default router;
