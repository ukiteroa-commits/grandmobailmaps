import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, TrendingUp, Loader2, Inbox } from 'lucide-react';
import ListingCard from './ListingCard.jsx';
import { useAuth, api } from '../auth/AuthContext.jsx';
import { useToast } from './Layout.jsx';

const SERVER = '32';

export default function AutoAksyTab() {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('cars'); // 'cars' | 'stocks'
  const [cars, setCars] = useState(null);
  const [stocks, setStocks] = useState(null);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    const type = tab;
    try {
      await api(`/api/${type}/${id}`, { method: 'DELETE' });
      (type === 'cars' ? setCars : setStocks)((rows) => rows.filter((x) => x.id !== id));
      toast('Объявление удалено');
    } catch (err) {
      toast(err.message || 'Не удалось удалить');
    }
  };

  useEffect(() => {
    let alive = true;
    setError(null);
    Promise.all([
      fetch(`/api/cars?server=${SERVER}`).then((r) => r.json()),
      fetch(`/api/stocks?server=${SERVER}`).then((r) => r.json()),
    ])
      .then(([c, s]) => {
        if (!alive) return;
        setCars(Array.isArray(c) ? c : []);
        setStocks(Array.isArray(s) ? s : []);
      })
      .catch(() => alive && setError('Не удалось загрузить данные. Запущен ли бэкенд (порт 3001)?'));
    return () => {
      alive = false;
    };
  }, []);

  const list = tab === 'cars' ? cars : stocks;

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      {/* Переключатель подразделов */}
      <div className="glass-card mb-4 flex p-1">
        {[
          { id: 'cars', label: 'Машины', icon: Car },
          { id: 'stocks', label: 'Акции', icon: TrendingUp },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              tab === id ? 'text-white' : 'text-white/40'
            }`}
          >
            {tab === id && (
              <motion.span
                layoutId="auto-tab"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} /> {label}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="glass-card border-red-500/30 p-4 text-sm text-red-400">{error}</div>
      )}

      {!error && list === null && (
        <div className="flex justify-center py-16 text-violet-400">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      {!error && list?.length === 0 && (
        <div className="glass-card flex flex-col items-center gap-2 p-10 text-white/40">
          <Inbox size={40} strokeWidth={1.2} />
          <p className="text-sm">Пока нет объявлений</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list?.map((item, i) => (
            <ListingCard
              key={item.id}
              type={tab === 'cars' ? 'car' : 'stock'}
              data={item}
              onDelete={remove}
              canDelete={!!user && item.user_id === user.id}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
