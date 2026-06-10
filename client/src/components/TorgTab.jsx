import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Inbox, PenLine, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard.jsx';
import { useToast } from './Layout.jsx';
import { useAuth, api } from '../auth/AuthContext.jsx';

const FILTERS = ['Все', '32', '38', 'Другой'];

export default function TorgTab() {
  const toast = useToast();
  const { user } = useAuth();
  const [trades, setTrades] = useState(null);
  const [filter, setFilter] = useState('Все');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ server: '32', item: '', price: '', contact: '' });

  const load = () => {
    fetch('/api/trades')
      .then((r) => r.json())
      .then((data) => setTrades(Array.isArray(data) ? data : []))
      .catch(() => setTrades([]));
  };
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.item.trim() || !form.price) {
      toast('Заполните обязательные поля!');
      return;
    }
    setSubmitting(true);
    try {
      const created = await api('/api/trades', { method: 'POST', body: JSON.stringify(form) });
      setTrades((t) => [created, ...(t || [])]);
      setForm({ server: form.server, item: '', price: '', contact: '' });
      toast('Объявление опубликовано!');
    } catch (err) {
      toast(err.message || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await api(`/api/trades/${id}`, { method: 'DELETE' });
      setTrades((t) => t.filter((x) => x.id !== id));
      toast('Объявление удалено');
    } catch (err) {
      toast(err.message || 'Не удалось удалить');
    }
  };

  const filtered =
    trades === null ? null : filter === 'Все' ? trades : trades.filter((t) => t.server === filter);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      {/* Форма подачи объявления */}
      {user ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="glass-card neon-glow mb-5 space-y-3 p-4"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-400">
            <PenLine size={16} /> Подать объявление
          </h2>
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-xs text-white/50">
            Публикуется от имени:
            <span className="font-bold text-violet-300">{user.nickname}</span>
          </div>

          <select value={form.server} onChange={set('server')} className="input-neon" required>
            <option value="32">Сервер 32</option>
            <option value="38">Сервер 38</option>
            <option value="Другой">Другой</option>
          </select>

          <input
            className="input-neon"
            placeholder="Название товара *"
            value={form.item}
            onChange={set('item')}
            required
          />
          <input
            className="input-neon"
            type="number"
            min="0"
            placeholder="Цена ($) *"
            value={form.price}
            onChange={set('price')}
            required
          />
          <input
            className="input-neon"
            placeholder="Контакты (Discord / Telegram / телефон)"
            value={form.contact}
            onChange={set('contact')}
          />

          <button
            type="submit"
            disabled={submitting}
            className="btn-buy flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : '📝'} Подать объявление
          </button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card neon-glow mb-5 flex flex-col items-center gap-3 p-6 text-center"
        >
          <p className="text-sm text-white/60">
            Чтобы подать объявление, войдите в аккаунт — оно будет привязано к вашему нику
          </p>
          <Link
            to="/profile"
            className="btn-buy flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
          >
            <LogIn size={15} /> Войти / Регистрация
          </Link>
        </motion.div>
      )}

      {/* Фильтр по серверу */}
      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              filter === f
                ? 'text-white'
                : 'border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70'
            }`}
            style={
              filter === f
                ? {
                    background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
                    boxShadow: '0 0 15px rgba(124,58,237,0.4)',
                  }
                : undefined
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Лента объявлений (новые сверху) */}
      {filtered === null && (
        <div className="flex justify-center py-12 text-violet-400">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      {filtered?.length === 0 && (
        <div className="glass-card flex flex-col items-center gap-2 p-10 text-white/40">
          <Inbox size={40} strokeWidth={1.2} />
          <p className="text-sm">Объявлений нет</p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered?.map((t, i) => (
            <ListingCard
              key={t.id}
              type="trade"
              data={t}
              onDelete={remove}
              canDelete={!!user && t.user_id === user.id}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
