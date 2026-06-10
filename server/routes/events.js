import { Router } from 'express';
import { readTable, writeTable } from '../utils/db.js';

const router = Router();

// GET /api/events
router.get('/', async (req, res, next) => {
  try {
    const events = await readTable('events');
    res.json(events);
  } catch (e) {
    next(e);
  }
});

// POST /api/events — обновление/добавление гайда (для админа)
router.post('/', async (req, res, next) => {
  try {
    const { id, title, guide_text, youtube_embed_url } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title — обязательное поле' });

    const events = await readTable('events');
    const now = new Date().toISOString().slice(0, 10);

    if (id) {
      const idx = events.findIndex((e) => String(e.id) === String(id));
      if (idx !== -1) {
        events[idx] = {
          ...events[idx],
          title,
          guide_text: guide_text ?? events[idx].guide_text,
          youtube_embed_url: youtube_embed_url ?? events[idx].youtube_embed_url,
          updated_at: now,
        };
        await writeTable('events', events);
        return res.json(events[idx]);
      }
    }

    const nextId = events.reduce((m, e) => Math.max(m, Number(e.id) || 0), 0) + 1;
    const ev = {
      id: nextId,
      title,
      guide_text: guide_text || '',
      youtube_embed_url: youtube_embed_url || '',
      updated_at: now,
    };
    events.push(ev);
    await writeTable('events', events);
    res.status(201).json(ev);
  } catch (e) {
    next(e);
  }
});

export default router;
