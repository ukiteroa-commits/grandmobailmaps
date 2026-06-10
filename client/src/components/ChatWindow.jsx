import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth, api } from '../auth/AuthContext.jsx';
import { useToast } from './Layout.jsx';

const POLL_MS = 4000;

export default function ChatWindow({ chat, server }) {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const serverLabel = server?.id === 'other' ? 'GMRP' : `${server?.id || '32'} сервер`;

  // Загрузка + поллинг сообщений
  useEffect(() => {
    let alive = true;
    setMessages(null);
    const load = () =>
      fetch(`/api/messages?server=${encodeURIComponent(server.id)}&chat=${encodeURIComponent(chat.id)}`)
        .then((r) => r.json())
        .then((d) => alive && setMessages(Array.isArray(d) ? d : []))
        .catch(() => alive && setMessages([]));
    load();
    const t = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [chat.id, server.id]);

  // Автоскролл вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  const send = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    try {
      const msg = await api('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ server: server.id, chat: chat.id, text: t }),
      });
      setMessages((m) => [...(m || []), msg]);
      setText('');
    } catch (err) {
      toast(err.message || 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  };

  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      key={`${server?.id}-${chat.id}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="glass-card flex h-full flex-col"
    >
      {/* Шапка чата */}
      <div className="flex items-center gap-3 border-b border-white/5 p-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: chat.color, boxShadow: `0 0 12px ${chat.color}80` }}
        >
          {chat.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold leading-tight">
            {chat.isGeneral ? chat.name : `Чат посёлка ${chat.name}`}
          </h3>
          <p className="text-[11px] text-emerald-400">● {serverLabel}</p>
        </div>
        <a
          href="https://discord.gg/grandmobile"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2 py-1.5 text-[10px] font-semibold text-indigo-300"
          title="Discord сервера"
        >
          <ExternalLink size={11} /> Discord
        </a>
      </div>

      {/* Сообщения */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages === null && (
          <div className="flex justify-center py-8 text-violet-400">
            <Loader2 className="animate-spin" size={26} />
          </div>
        )}

        {messages?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/30">
            <span className="text-3xl">💬</span>
            <p className="text-sm">
              Здесь пока тихо.
              <br />
              Напишите первое сообщение!
            </p>
          </div>
        )}

        {messages?.map((m) => {
          const mine = user && m.user_id === user.id;
          return (
            <div key={m.id} className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: mine ? '#7c3aed' : chat.color }}
              >
                {m.nickname[0].toUpperCase()}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                  mine ? 'rounded-tr-sm' : 'rounded-tl-sm'
                }`}
                style={{
                  background: mine ? 'linear-gradient(135deg,#7c3aed50,#3b82f650)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${mine ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                {!mine && (
                  <div className="mb-0.5 text-[11px] font-bold" style={{ color: chat.color }}>
                    {m.nickname}
                  </div>
                )}
                <div className="break-words text-sm text-white/90">{m.text}</div>
                <div className="mt-0.5 text-right text-[9px] text-white/30">{fmtTime(m.created_at)}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={send} className="border-t border-white/5 p-3">
        <div className="flex items-center gap-2">
          <input
            className="input-neon flex-1"
            placeholder={`Сообщение от ${user?.nickname || '...'}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="btn-buy flex h-11 w-11 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
            aria-label="Отправить"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
