import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { storage } from './storage.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = 'gmrp_token';

// fetch с токеном
export async function api(url, opts = {}) {
  const token = storage.get(TOKEN_KEY);
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...opts, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* пустой ответ */
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Ошибка ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Восстановление сессии
  useEffect(() => {
    const token = storage.get(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => storage.remove(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (nickname, password) => {
    const d = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nickname, password }),
    });
    storage.set(TOKEN_KEY, d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (nickname, password, servers) => {
    const d = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nickname, password, servers }),
    });
    storage.set(TOKEN_KEY, d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch {
      /* не критично */
    }
    storage.remove(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateServers = useCallback(async (servers) => {
    const d = await api('/api/auth/me', { method: 'PUT', body: JSON.stringify({ servers }) });
    setUser(d.user);
    return d.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateServers }}>
      {children}
    </AuthContext.Provider>
  );
}
