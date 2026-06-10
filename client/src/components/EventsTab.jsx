import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Loader2, Tent, CalendarClock } from 'lucide-react';

export default function EventsTab() {
  const [events, setEvents] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-glow mb-5 flex items-center gap-3 p-4"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
          <Tent size={22} />
        </div>
        <div>
          <h2 className="font-bold">Ивенты и гайды — сервер 32</h2>
          <p className="text-xs text-white/40">Нажмите на карточку, чтобы открыть гайд</p>
        </div>
      </motion.div>

      {events === null && (
        <div className="flex justify-center py-12 text-violet-400">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      <div className="space-y-3">
        {events?.map((ev, i) => {
          const open = openId === ev.id;
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
              style={open ? { boxShadow: '0 0 25px rgba(124,58,237,0.35)', borderColor: 'rgba(124,58,237,0.4)' } : undefined}
            >
              <button
                onClick={() => setOpenId(open ? null : ev.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold"
                    style={{
                      background: 'linear-gradient(135deg,#7c3aed30,#06b6d430)',
                      color: open ? '#a78bfa' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-semibold ${open ? 'text-violet-300' : ''}`}>{ev.title}</span>
                </div>
                <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-white/40">
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 border-t border-white/5 p-4">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-white/75">
                        {ev.guide_text}
                      </p>

                      {ev.youtube_embed_url && (
                        <div
                          className="overflow-hidden rounded-xl border border-white/10"
                          style={{ aspectRatio: '16/9' }}
                        >
                          <iframe
                            src={ev.youtube_embed_url}
                            title={ev.title}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      )}

                      {ev.updated_at && (
                        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                          <CalendarClock size={12} /> Обновлено: {ev.updated_at}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
