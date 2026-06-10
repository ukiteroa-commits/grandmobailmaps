import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { readTable, writeTable } from '../utils/db.js';
import { getUserFromReq } from '../utils/auth.js';

const router = Router();

// GET /api/cars?server=32&mine=1
router.get('/', async (req, res, next) => {
  try {
    let cars = await readTable('cars');
    const { server, mine } = req.query;
    if (server) cars = cars.filter((c) => String(c.server) === String(server));
    if (mine) {
      const user = await getUserFromReq(req);
      if (!user) return res.status(401).json({ error: 'Не авторизован' });
      cars = cars.filter((c) => c.user_id === user.id);
    }
    cars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(cars);
  } catch (e) {
    next(e);
  }
});

// POST /api/cars — только для авторизованных
router.post('/', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Войдите, чтобы подать объявление' });

    const { server, title, plate, price, contact, image_url } = req.body || {};
    if (!server || !title || !price || !contact) {
      return res.status(400).json({ error: 'server, title, price, contact — обязательные поля' });
    }
    const car = {
      id: uuid(),
      user_id: user.id,
      server: String(server),
      title: String(title),
      plate: plate ? String(plate) : '',
      price: String(price),
      contact: String(contact),
      image_url: image_url ? String(image_url) : '',
      created_at: new Date().toISOString(),
    };
    const cars = await readTable('cars');
    cars.push(car);
    await writeTable('cars', cars);
    res.status(201).json(car);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/cars/:id — только своё
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });

    const cars = await readTable('cars');
    const idx = cars.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Не найдено' });
    if (cars[idx].user_id && cars[idx].user_id !== user.id)
      return res.status(403).json({ error: 'Можно удалять только свои объявления' });

    const [removed] = cars.splice(idx, 1);
    await writeTable('cars', cars);
    res.json({ ok: true, removed });
  } catch (e) {
    next(e);
  }
});

export default router;
