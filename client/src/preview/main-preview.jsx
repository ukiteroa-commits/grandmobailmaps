// Превью-сборка: одиночный HTML-файл без бэкенда.
// fetch('/api/...') перехватывается и работает с данными в памяти
// (включая авторизацию и чаты — всё живёт до перезагрузки страницы,
// аккаунт дополнительно сохраняется в localStorage).
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from '../App.jsx';
import '../index.css';

import carsData from '../../../server/data/cars.json';
import stocksData from '../../../server/data/stocks.json';
import tradesData from '../../../server/data/trades.json';
import eventsData from '../../../server/data/events.json';

import { storage } from '../auth/storage.js';

const LS_USERS = 'gmrp_preview_users';
const loadUsers = () => {
  try {
    return JSON.parse(storage.get(LS_USERS)) || [];
  } catch {
    return [];
  }
};
const saveUsers = (u) => storage.set(LS_USERS, JSON.stringify(u));

const LS_MSGS = 'gmrp_preview_messages';
const loadMsgs = () => {
  try {
    return JSON.parse(storage.get(LS_MSGS)) || [];
  } catch {
    return [];
  }
};
const saveMsgs = (m) => storage.set(LS_MSGS, JSON.stringify(m));

const db = {
  cars: [...carsData],
  stocks: [...stocksData],
  trades: [...tradesData],
  events: [...eventsData],
  users: loadUsers(),
  messages: loadMsgs(),
};

const json = (data, status = 200) =>
  Promise.resolve({
    ok: status < 400,
    status,
    json: () => Promise.resolve(JSON.parse(JSON.stringify(data))),
  });

const uuid = () =>
  'xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  }) + '-' + Date.now().toString(16);

const pub = (u) => ({ id: u.id, nickname: u.nickname, servers: u.servers, created_at: u.created_at });

const getUser = (opts) => {
  const auth = opts.headers?.Authorization || opts.headers?.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  return db.users.find((u) => u.token === token) || null;
};

const realFetch =
  typeof window.fetch === 'function'
    ? window.fetch.bind(window)
    : () => Promise.reject(new Error('fetch is not available'));
window.fetch = (url, opts = {}) => {
  const u = String(url);
  if (!u.startsWith('/api/')) return realFetch(url, opts);

  const [path, query] = u.slice(5).split('?');
  const params = new URLSearchParams(query || '');
  const server = params.get('server');
  const mine = params.get('mine');
  const method = (opts.method || 'GET').toUpperCase();
  const body = opts.body ? JSON.parse(opts.body) : {};
  const me = getUser(opts);

  const sorted = (rows) =>
    [...rows].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  // ---- auth ----
  if (path === 'auth/register' && method === 'POST') {
    const nick = String(body.nickname || '').trim();
    if (nick.length < 3) return json({ error: 'Никнейм минимум 3 символа' }, 400);
    if (String(body.password || '').length < 4) return json({ error: 'Пароль минимум 4 символа' }, 400);
    const servers = (body.servers || []).filter((s) => ['32', '38', 'other'].includes(s));
    if (!servers.length) return json({ error: 'Выберите хотя бы один сервер' }, 400);
    if (db.users.some((x) => x.nickname.toLowerCase() === nick.toLowerCase()))
      return json({ error: 'Никнейм уже занят' }, 409);
    const user = {
      id: uuid(),
      nickname: nick,
      password: String(body.password), // превью: без хеша
      servers,
      token: uuid() + uuid(),
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    saveUsers(db.users);
    return json({ token: user.token, user: pub(user) }, 201);
  }
  if (path === 'auth/login' && method === 'POST') {
    const user = db.users.find(
      (x) => x.nickname.toLowerCase() === String(body.nickname || '').trim().toLowerCase()
    );
    if (!user || user.password !== String(body.password))
      return json({ error: 'Неверный никнейм или пароль' }, 401);
    user.token = uuid() + uuid();
    saveUsers(db.users);
    return json({ token: user.token, user: pub(user) });
  }
  if (path === 'auth/me' && method === 'GET') {
    if (!me) return json({ error: 'Не авторизован' }, 401);
    return json({ user: pub(me) });
  }
  if (path === 'auth/me' && method === 'PUT') {
    if (!me) return json({ error: 'Не авторизован' }, 401);
    const servers = (body.servers || []).filter((s) => ['32', '38', 'other'].includes(s));
    if (!servers.length) return json({ error: 'Выберите хотя бы один сервер' }, 400);
    me.servers = servers;
    saveUsers(db.users);
    return json({ user: pub(me) });
  }
  if (path === 'auth/logout' && method === 'POST') {
    if (me) {
      me.token = null;
      saveUsers(db.users);
    }
    return json({ ok: true });
  }

  // ---- messages ----
  if (path === 'messages' && method === 'GET') {
    const chat = params.get('chat');
    return json(
      db.messages
        .filter((m) => m.server === server && m.chat === chat)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(-100)
    );
  }
  if (path === 'messages' && method === 'POST') {
    if (!me) return json({ error: 'Войдите, чтобы писать в чат' }, 401);
    const msg = {
      id: uuid(),
      server: String(body.server),
      chat: String(body.chat),
      user_id: me.id,
      nickname: me.nickname,
      text: String(body.text || '').trim(),
      created_at: new Date().toISOString(),
    };
    db.messages.push(msg);
    saveMsgs(db.messages);
    return json(msg, 201);
  }

  // ---- listings ----
  const listTables = ['cars', 'stocks', 'trades'];
  if (method === 'GET' && listTables.includes(path)) {
    let rows = db[path];
    if (server) rows = rows.filter((r) => String(r.server) === server);
    if (mine) {
      if (!me) return json({ error: 'Не авторизован' }, 401);
      rows = rows.filter((r) => r.user_id === me.id);
    }
    return json(sorted(rows));
  }
  if (method === 'GET' && path === 'events') return json(db.events);

  if (method === 'POST' && path === 'trades') {
    if (!me) return json({ error: 'Войдите, чтобы подать объявление' }, 401);
    const t = {
      id: uuid(),
      user_id: me.id,
      server: String(body.server || ''),
      nickname: me.nickname,
      item: String(body.item || ''),
      price: String(body.price || ''),
      contact: String(body.contact || ''),
      created_at: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    db.trades.push(t);
    return json(t, 201);
  }
  if (method === 'POST' && (path === 'cars' || path === 'stocks')) {
    if (!me) return json({ error: 'Войдите, чтобы подать объявление' }, 401);
    const row = { id: uuid(), user_id: me.id, ...body, created_at: new Date().toISOString() };
    db[path].push(row);
    return json(row, 201);
  }

  // DELETE /api/{cars|stocks|trades}/:id
  const delMatch = path.match(/^(cars|stocks|trades)\/(.+)$/);
  if (method === 'DELETE' && delMatch) {
    if (!me) return json({ error: 'Не авторизован' }, 401);
    const [, table, id] = delMatch;
    const i = db[table].findIndex((r) => r.id === id);
    if (i === -1) return json({ error: 'Не найдено' }, 404);
    if (db[table][i].user_id && db[table][i].user_id !== me.id)
      return json({ error: 'Можно удалять только свои объявления' }, 403);
    const [removed] = db[table].splice(i, 1);
    return json({ ok: true, removed });
  }

  return json({ error: 'not found' }, 404);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
