import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Loader2, Inbox, Car, TrendingUp, Coins, Settings2 } from 'lucide-react';
import { useAuth, api } from '../auth/AuthContext.jsx';
import { useToast } from './Layout.jsx';
import ListingCard from './ListingCard.jsx';

const ALL_SERVER_IDS = Array.from({ length: 38 }, (_, i) => String(i + 1));

const SECTIONS = [
  { id: 'trades', label: 'Торг', icon: Coins },
  { id: 'cars', label: 'Авто', icon: Car },
  { id: 'stocks', label: 'Акции', icon: TrendingUp },
];

export default function ProfileTab() {
  const { user, logout, updateServers } = useAuth();
  const toast = useToast();
  const [section, setSection] = useState('trades');
  const [data, setData] = useState({ trades: null, cars: null, stocks: null });
  const [editServers, setEditServers] = useState(false);
  const [srv, setSrv] = useState(user?.servers || ['32']);

  const load = () => {
    ['trades', 'cars', 'stocks'].forEach((t) => {
      api(`/api/${t}?mine=1`)
        .then((rows) => setData((d) => ({ ...d, [t]: rows })))
        .catch(() => setData((d) => ({ ...d, [t]: [] })));
    });
  };
  useEffect(load, []);

  const remove = (type) => async (id) => {
    try {
      await api(`/api/${type}/${id}`, { method: 'DELETE' });
      setData((d) => ({ ...d, [type]: d[type].filter((x) => x.id !== id) }));
      toast('Объявление удалено');
    } catch (e) {
      toast(e.message);
    }
  };

  const toggleSrv = (id) => {
    if (srv.includes(id)) {
      setSrv((s) => s.filter((x) => x !== id));
    } else {
      if (srv.length >= 5) {
        toast('Можно выбрать не более 5 серверов');
        return;
      }
      setSrv((s) => [...s, id]);
    }
  };

  const saveServers = async () => {
    try {
      await updateServers(srv);
      setEditServers(false);
      toast('Сервера обновлены');
    } catch (e) {
      toast(e.message);
    }
  };

  if (!user) return null;

  const list = data[section];

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      {/* Карточка профиля */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-glow mb-4 p-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold text-white"
            style={{
              background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
              boxShadow: '0 0 18px rgba(124,58,237,0.6)',
            }}
          >
            {user.nickname[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-bold">{user.nickname}</div>
            <div className="mt-0.5 flex flex-wrap gap-1">
              {user.servers.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{
                    background: s === '32' ? '#7c3aed' : s === '38' ? '#3b82f6' : '#06b6d4',
                    boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              setSrv(user.servers);
              setEditServers((v) => !v);
            }}
            className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Мои сервера"
          >
            <Settings2 size={18} />
          </button>
          <button
            onClick={() => logout().then(() => toast('Вы вышли из аккаунта'))}
            className="rounded-lg p-2 text-red-400/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Выйти"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Редактирование серверов */}
        <AnimatePresence>
          {editServers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-white/5 pt-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Сервера (1-38, до 5 штук)
                </div>
                <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1">
                  {ALL_SERVER_IDS.map((id) => {
                    const isSelected = srv.includes(id);
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => toggleSrv(id)}
                        className={`h-9 w-9 rounded-lg text-xs font-bold transition-all ${
                          isSelected 
                            ? 'text-white bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30' 
                            : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {id}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-white/30 mt-2 text-center">
                  Выбрано: {srv.length} / 5
                </p>
                <button
                  onClick={saveServers}
                  disabled={srv.length === 0}
                  className="btn-buy mt-3 w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Секции моих объявлений */}
      <div className="glass-card mb-4 flex p-1">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
              section === id ? 'text-white' : 'text-white/40'
            }`}
          >
            {section === id && (
              <motion.span
                layoutId="profile-tab"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
                  boxShadow: '0 0 15px rgba(124,58,237,0.4)',
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon size={14} /> {label}
              {data[id] && (
                <span className="rounded-full bg-white/15 px-1.5 text-[10px]">{data[id].length}</span>
              )}
            </span>
          </button>
        ))}
      </div>

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
        Мои объявления
      </h3>

      {list === null && (
        <div className="flex justify-center py-10 text-violet-400">
          <Loader2 className="animate-spin" size={28} />
        </div>
      )}

      {list?.length === 0 && (
        <div className="glass-card flex flex-col items-center gap-2 p-10 text-white/40">
          <Inbox size={40} strokeWidth={1.2} />
          <p className="text-sm">У вас пока нет объявлений</p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {list?.map((item, i) => (
            <ListingCard
              key={item.id}
              type={section === 'trades' ? 'trade' : section === 'cars' ? 'car' : 'stock'}
              data={item}
              onDelete={remove(section)}
              canDelete
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}