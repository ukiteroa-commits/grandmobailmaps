import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Loader2, Gamepad2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useToast } from './Layout.jsx';
import ProfileTab from './ProfileTab.jsx';

const SERVER_OPTIONS = [
  { id: '32', label: 'Сервер 32', color: '#7c3aed' },
  { id: '38', label: 'Сервер 38', color: '#3b82f6' },
  { id: 'other', label: 'Другой', color: '#06b6d4' },
];

export default function AuthTab() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center py-16 text-violet-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (user) return <ProfileTab />;
  return <AuthForm />;
}

function AuthForm() {
  const { login, register } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [servers, setServers] = useState(['32']);
  const [busy, setBusy] = useState(false);

  const toggleServer = (id) =>
    setServers((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(nickname, password);
        toast('С возвращением!');
      } else {
        if (servers.length === 0) {
          toast('Выберите хотя бы один сервер');
          setBusy(false);
          return;
        }
        await register(nickname, password, servers);
        toast('Аккаунт создан!');
      }
    } catch (err) {
      toast(err.message || 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <div
          className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-violet-400"
          style={{ background: 'rgba(124,58,237,0.15)', boxShadow: '0 0 30px rgba(124,58,237,0.35)' }}
        >
          <Gamepad2 size={30} />
        </div>
        <h2 className="text-xl font-bold">
          {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
        </h2>
        <p className="mt-1 text-sm text-white/40">
          {mode === 'login'
            ? 'Войдите, чтобы видеть свои объявления и писать в чаты'
            : 'Укажите игровой ник и сервера, на которых играете'}
        </p>
      </motion.div>

      {/* Переключатель вход/регистрация */}
      <div className="glass-card mb-5 flex p-1">
        {[
          { id: 'login', label: 'Вход', icon: LogIn },
          { id: 'register', label: 'Регистрация', icon: UserPlus },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              mode === id ? 'text-white' : 'text-white/40'
            }`}
          >
            {mode === id && (
              <motion.span
                layoutId="auth-tab"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={15} /> {label}
            </span>
          </button>
        ))}
      </div>

      <motion.form
        key={mode}
        initial={{ opacity: 0, x: mode === 'login' ? -15 : 15 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={submit}
        className="glass-card neon-glow space-y-3 p-4"
      >
        <input
          className="input-neon"
          placeholder="Игровой никнейм (Ivan_Krutoy)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          minLength={3}
          autoComplete="username"
        />
        <input
          className="input-neon"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {mode === 'register' && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              На каких серверах играешь?
            </div>
            <div className="flex gap-2">
              {SERVER_OPTIONS.map((s) => {
                const on = servers.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleServer(s.id)}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      on ? 'text-white' : 'border border-white/10 bg-white/[0.03] text-white/40'
                    }`}
                    style={
                      on
                        ? { background: s.color, boxShadow: `0 0 15px ${s.color}70` }
                        : undefined
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-buy flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : mode === 'login' ? (
            <LogIn size={16} />
          ) : (
            <UserPlus size={16} />
          )}
          {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </motion.form>
    </div>
  );
}
