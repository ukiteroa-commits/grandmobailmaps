import { createContext, useCallback, useContext, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Map, Car, Coins, Tent, MessageCircle, CheckCircle2, UserCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext.jsx';

// ---- Toast context ----
const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

const NAV_ITEMS = [
  { to: '/', label: 'Карта', icon: Map },
  { to: '/auto-aksy', label: 'Авто/Аксы', icon: Car },
  { to: '/torg', label: 'Торг', icon: Coins },
  { to: '/events', label: 'Ивенты', icon: Tent },
  { to: '/chats', label: 'Чаты', icon: MessageCircle },
];

const TITLES = {
  '/': 'Карта посёлков',
  '/auto-aksy': 'Авто и Акции',
  '/torg': 'Торговая площадка',
  '/events': 'Ивенты и гайды',
  '/chats': 'Чаты посёлков',
  '/profile': 'Мой профиль',
};

export default function Layout() {
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const { user } = useAuth();

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message });
    setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/5 px-4"
          style={{ background: 'rgba(15,15,26,0.8)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                boxShadow: '0 0 15px rgba(124,58,237,0.5)',
              }}
            >
              32
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide">GRAND MOBILE RP</div>
              <div className="text-[10px] uppercase tracking-widest text-cyan-400">
                {TITLES[location.pathname] || 'Дашборд'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30 sm:inline-block">
              ● ONLINE
            </span>
            {/* Профиль / вход */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-colors ${
                  isActive ? 'text-violet-300' : 'text-white/60 hover:text-white'
                }`
              }
              aria-label="Профиль"
            >
              {user ? (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold text-white"
                  style={{
                    background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
                    boxShadow: '0 0 12px rgba(124,58,237,0.6)',
                  }}
                >
                  {user.nickname[0].toUpperCase()}
                </span>
              ) : (
                <UserCircle2 size={26} strokeWidth={1.6} />
              )}
            </NavLink>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </main>

        {/* Bottom navigation */}
        <nav
          className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-white/5"
          style={{ background: 'rgba(15,15,26,0.75)', backdropFilter: 'blur(16px)' }}
        >
          <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                    isActive ? 'nav-active text-violet-400' : 'text-white/40 hover:text-white/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet-400"
                          style={{ boxShadow: '0 0 8px #7c3aed' }}
                        />
                      )}
                    </div>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: 'rgba(20,20,35,0.95)',
                border: '1px solid rgba(124,58,237,0.5)',
                boxShadow: '0 0 25px rgba(124,58,237,0.4)',
              }}
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
