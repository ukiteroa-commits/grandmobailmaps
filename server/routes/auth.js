import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { readTable, writeTable } from '../utils/db.js';
import { makeSalt, hashPassword, makeToken, getUserFromReq, publicUser } from '../utils/auth.js';

const router = Router();
const VALID_SERVERS = ['32', '38', 'other'];

// POST /api/auth/register { nickname, password, servers: ["32","38"] }
router.post('/register', async (req, res, next) => {
  try {
    const { nickname, password, servers } = req.body || {};
    const nick = String(nickname || '').trim();
    if (nick.length < 3) return res.status(400).json({ error: 'Никнейм минимум 3 символа' });
    if (String(password || '').length < 4)
      return res.status(400).json({ error: 'Пароль минимум 4 символа' });

    const srv = (Array.isArray(servers) ? servers : []).filter((s) =>
      VALID_SERVERS.includes(String(s))
    );
    if (srv.length === 0) return res.status(400).json({ error: 'Выберите хотя бы один сервер' });

    const users = await readTable('users');
    if (users.some((u) => u.nickname.toLowerCase() === nick.toLowerCase()))
      return res.status(409).json({ error: 'Никнейм уже занят' });

    const salt = makeSalt();
    const user = {
      id: uuid(),
      nickname: nick,
      salt,
      password_hash: hashPassword(password, salt),
      servers: srv,
      token: makeToken(),
      created_at: new Date().toISOString(),
    };
    users.push(user);
    await writeTable('users', users);
    res.status(201).json({ token: user.token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login { nickname, password }
router.post('/login', async (req, res, next) => {
  try {
    const { nickname, password } = req.body || {};
    const users = await readTable('users');
    const user = users.find(
      (u) => u.nickname.toLowerCase() === String(nickname || '').trim().toLowerCase()
    );
    if (!user || hashPassword(password, user.salt) !== user.password_hash)
      return res.status(401).json({ error: 'Неверный никнейм или пароль' });

    user.token = makeToken();
    await writeTable('users', users);
    res.json({ token: user.token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });
    res.json({ user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

// PUT /api/auth/me { servers } — обновить список серверов
router.put('/me', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Не авторизован' });
    const srv = (Array.isArray(req.body?.servers) ? req.body.servers : []).filter((s) =>
      VALID_SERVERS.includes(String(s))
    );
    if (srv.length === 0) return res.status(400).json({ error: 'Выберите хотя бы один сервер' });

    const users = await readTable('users');
    const u = users.find((x) => x.id === user.id);
    u.servers = srv;
    await writeTable('users', users);
    res.json({ user: publicUser(u) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    const user = await getUserFromReq(req);
    if (user) {
      const users = await readTable('users');
      const u = users.find((x) => x.id === user.id);
      u.token = null;
      await writeTable('users', users);
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
