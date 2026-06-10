import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Server, Users, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MAP_HOUSES } from '../data/houses.js';
import ChatWindow from './ChatWindow.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

const ALL_SERVERS = [
  { id: '32', name: 'Сервер 32', desc: 'Основной сервер дашборда', color: '#7c3aed', badge: '32' },
  { id: '38', name: 'Сервер 38', desc: 'Дополнительный сервер', color: '#3b82f6', badge: '38' },
  { id: 'other', name: 'Другой сервер', desc: 'Остальные сервера GMRP', color: '#06b6d4', badge: '•' },
];

const buildChats = (server) => [
  {
    id: 'general',
    name: `Общий чат (${server.id === 'other' ? 'GMRP' : server.id + ' сервер'})`,
    emoji: '💬',
    color: server.color,
    isGeneral: true,
  },
  ...MAP_HOUSES.map((h) => ({
    id: `village-${h.id}`,
    name: h.name,
    emoji: '🏘️',
    color: h.color,
    isGeneral: false,
  })),
];

export default function ChatsTab() {
  const { user, loading } = useAuth();
  const [server, setServer] = useState(null);
  const [activeId, setActiveId] = useState('general');
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return null;

  // ---------- Требуется вход ----------
  if (!user) {
    return (
      <div className="mx-auto max-w-sm px-4 py-10 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-violet-400"
            style={{ background: 'rgba(124,58,237,0.15)', boxShadow: '0 0 30px rgba(124,58,237,0.35)' }}
          >
            <Users size={30} />
          </div>
          <h2 className="text-lg font-bold">Чаты доступны после входа</h2>
          <p className="mt-2 text-sm text-white/40">
            Войдите в аккаунт — увидите сервера, на которых играете, и сможете писать от своего ника
          </p>
          <Link
            to="/profile"
            className="btn-buy mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <LogIn size={15} /> Войти / Регистрация
          </Link>
        </motion.div>
      </div>
    );
  }

  // Только сервера, на которых играет пользователь
  const myServers = ALL_SERVERS.filter((s) => user.servers.includes(s.id));

  // ---------- Шаг 1: выбор сервера ----------
  if (!server) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-violet-400"
            style={{ background: 'rgba(124,58,237,0.15)', boxShadow: '0 0 25px rgba(124,58,237,0.3)' }}
          >
            <Server size={26} />
          </div>
          <h2 className="text-lg font-bold">Ваши сервера</h2>
          <p className="mt-1 text-sm text-white/40">
            {user.nickname}, выберите сервер для чата
          </p>
        </motion.div>

        <div className="space-y-3">
          {myServers.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setServer(s);
                setActiveId('general');
                setMobileOpen(false);
              }}
              className="glass-card flex w-full items-center gap-4 p-4 text-left transition-all hover:bg-white/[0.06]"
              style={{ boxShadow: `0 0 20px ${s.color}25` }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold text-white"
                style={{ background: s.color, boxShadow: `0 0 15px ${s.color}80` }}
              >
                {s.badge}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{s.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <Users size={12} /> {s.desc}
                </div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-white/30" />
            </motion.button>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-white/30">
          Играете ещё где-то? Добавьте сервер в{' '}
          <Link to="/profile" className="text-violet-400 underline">
            профиле
          </Link>
        </p>
      </div>
    );
  }

  // ---------- Шаг 2-3: список чатов + окно ----------
  const chats = buildChats(server);
  const active = chats.find((c) => c.id === activeId) || chats[0];

  const select = (id) => {
    setActiveId(id);
    setMobileOpen(true);
  };

  return (
    <div className="mx-auto h-[calc(100vh-3.5rem-5rem)] max-w-5xl px-4 py-3">
      {/* Шапка: назад к выбору сервера */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => setServer(null)}
          className="flex items-center gap-1 text-xs font-semibold text-violet-400"
        >
          <ChevronLeft size={15} /> Выбор сервера
        </button>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
          style={{ background: server.color, boxShadow: `0 0 10px ${server.color}80` }}
        >
          {server.id === 'other' ? 'GMRP' : `СЕРВЕР ${server.id}`}
        </span>
      </div>

      <div className="flex h-[calc(100%-2rem)] gap-4">
        {/* Левый столбец — список чатов */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass-card h-full w-full overflow-y-auto p-2 md:block md:w-72 ${
            mobileOpen ? 'hidden' : 'block'
          }`}
        >
          {chats.map((chat, i) => {
            const isActive = chat.id === activeId;
            return (
              <motion.button
                key={chat.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => select(chat.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                  isActive ? 'text-white' : 'text-white/60 hover:bg-white/5'
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(90deg, ${chat.color}25, transparent)`,
                        border: `1px solid ${chat.color}50`,
                        boxShadow: `0 0 18px ${chat.color}30`,
                      }
                    : { border: '1px solid transparent' }
                }
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{
                    background: chat.color,
                    boxShadow: isActive ? `0 0 12px ${chat.color}90` : 'none',
                  }}
                >
                  {chat.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {chat.emoji} {chat.name}
                  </div>
                  <div className="truncate text-[11px] text-white/30">
                    {chat.isGeneral ? 'Все игроки сервера' : 'Чат посёлка'}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Правый столбец — окно чата */}
        <div className={`h-full flex-1 ${mobileOpen ? 'block' : 'hidden'} md:block`}>
          <button
            onClick={() => setMobileOpen(false)}
            className="mb-2 flex items-center gap-1 text-xs font-semibold text-violet-400 md:hidden"
          >
            <ChevronLeft size={15} /> К списку чатов
          </button>
          <div className="h-[calc(100%-1.75rem)] md:h-full">
            <ChatWindow chat={active} server={server} />
          </div>
        </div>
      </div>
    </div>
  );
}
