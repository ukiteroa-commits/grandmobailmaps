import { motion } from 'framer-motion';
import { Car, ClipboardCopy, Trash2, TrendingUp, User, Phone, CalendarDays } from 'lucide-react';
import { useToast } from './Layout.jsx';

export const formatPrice = (p) => {
  const n = Number(String(p).replace(/\s/g, ''));
  if (Number.isNaN(n)) return `${p} $`;
  return `${n.toLocaleString('ru-RU')} $`;
};

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
};

function ServerBadge({ server }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
      style={{ background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}
    >
      {server}
    </span>
  );
}

function BuyButton({ contact }) {
  const toast = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact);
    } catch {
      // fallback для http / старых браузеров
      const ta = document.createElement('textarea');
      ta.value = contact;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast('Контакт скопирован!');
  };
  return (
    <button onClick={copy} className="btn-buy flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold">
      <ClipboardCopy size={16} /> Купить
    </button>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
    >
      <Trash2 size={15} /> Удалить
    </button>
  );
}

// type: "car" | "stock" | "trade"
// canDelete — показывать кнопку удаления (для своих объявлений)
export default function ListingCard({ type, data, onDelete, canDelete = false, index = 0 }) {
  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
      className="glass-card neon-glow overflow-hidden"
    >
      {type === 'car' && (
        <>
          <div className="relative h-40 w-full bg-white/[0.02]">
            {data.image_url ? (
              <img src={data.image_url} alt={data.title} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-violet-400/30">
                <Car size={64} strokeWidth={1} />
              </div>
            )}
            <div className="absolute left-3 top-3">
              <ServerBadge server={data.server} />
            </div>
          </div>
          <div className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold leading-tight">{data.title}</h3>
              {data.plate && (
                <span className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/80">
                  {data.plate}
                </span>
              )}
            </div>
            <div className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-xl font-extrabold text-transparent">
              {formatPrice(data.price)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Phone size={13} /> {data.contact}
            </div>
            <BuyButton contact={data.contact} />
            {canDelete && onDelete && <DeleteButton onClick={() => onDelete(data.id)} />}
          </div>
        </>
      )}

      {type === 'stock' && (
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-bold leading-tight">{data.business_name}</h3>
                {data.stock_number && (
                  <div className="text-xs text-white/40">Акция №{data.stock_number}</div>
                )}
              </div>
            </div>
            <ServerBadge server={data.server} />
          </div>
          <div>
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-xl font-extrabold text-transparent">
              {formatPrice(data.price_per_share)}
            </span>
            <span className="ml-1 text-xs text-white/40">/ шт.</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Phone size={13} /> {data.contact}
          </div>
          <BuyButton contact={data.contact} />
          {canDelete && onDelete && <DeleteButton onClick={() => onDelete(data.id)} />}
        </div>
      )}

      {type === 'trade' && (
        <div className="space-y-2.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <User size={15} className="text-violet-400" /> {data.nickname}
            </div>
            <ServerBadge server={data.server} />
          </div>
          <h3 className="text-base font-bold leading-tight">{data.item}</h3>
          <div className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-lg font-extrabold text-transparent">
            {formatPrice(data.price)}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {data.contact || '—'}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {new Date(data.date || data.created_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          {canDelete && onDelete && <DeleteButton onClick={() => onDelete(data.id)} />}
        </div>
      )}
    </motion.div>
  );
}
