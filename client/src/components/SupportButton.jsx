import { motion } from 'framer-motion';
import { Heart, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './Layout.jsx';

const STORES = [
  {
    name: 'Google Play',
    icon: '📱',
    url: 'https://play.google.com/store/apps/details?id=com.grand.launcher&hl=ru',
    color: '#3b82f6'
  },
  {
    name: 'App Store',
    icon: '🍎',
    url: 'https://apps.apple.com/ru/app/grand-mobile-rp-жизнь-и-тачки/id6741001464',
    color: '#8b5cf6'
  },
  {
    name: 'RuStore',
    icon: '🇷🇺',
    url: 'https://www.rustore.ru/catalog/app/com.grand.cr',
    color: '#10b981'
  },
  {
    name: 'Официальный сайт',
    icon: '🌐',
    url: 'https://grnd.gg/',
    color: '#f59e0b'
  }
];

const BANK_NAME = 'Ozon Банк';
const PHONE = '+7 996 499-14-03';

export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PHONE.replace(/\s/g, ''));
      toast('Номер телефона скопирован!');
    } catch {
      toast('Не удалось скопировать');
    }
  };

  return (
    <>
      {/* Кнопка поддержки */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
          boxShadow: '0 0 20px rgba(236,72,153,0.5)'
        }}
        aria-label="Поддержать проект"
      >
        <Heart size={22} fill="white" stroke="white" />
      </button>

      {/* Модальное окно */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-xl font-bold text-center bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Поддержать проект
            </h2>
            <p className="mb-6 text-center text-sm text-white/60">
              Спасибо, что пользуетесь картой GMRP!
            </p>

            {/* СБП - перевод по номеру телефона */}
            <div className="glass-card mb-6 p-4">
              <p className="mb-2 text-sm font-semibold text-white/80 text-center">
                🇷🇺 Перевод по СБП (без комиссии)
              </p>
              <div className="text-center mb-2">
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  {BANK_NAME}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-white/5 p-3">
                <span className="text-lg font-mono font-bold tracking-wider">
                  {PHONE}
                </span>
                <button
                  onClick={copyPhone}
                  className="rounded-lg bg-violet-500/20 p-2 text-violet-400 transition-colors hover:bg-violet-500/30"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-white/30 text-center">
                Нажмите на номер, чтобы скопировать<br/>
                Откройте приложение {BANK_NAME} → СБП → перевод по номеру телефона
              </p>
            </div>

            {/* Ссылки на магазины */}
            <div className="grid grid-cols-2 gap-2">
              {STORES.map((store) => (
                <a
                  key={store.name}
                  href={store.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: `${store.color}20`,
                    color: store.color,
                    border: `1px solid ${store.color}40`
                  }}
                >
                  <span>{store.icon}</span> {store.name}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-xl py-2.5 text-sm font-semibold text-white/60 hover:bg-white/10"
            >
              Закрыть
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}