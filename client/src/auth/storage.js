// Безопасная обёртка над localStorage.
// В sandbox-iframe (превью воркспейса) доступ к localStorage бросает SecurityError —
// тогда используем хранилище в памяти (живёт до перезагрузки страницы).
const memory = new Map();

let ls = null;
try {
  ls = window.localStorage;
  // проверка реального доступа
  const k = '__gmrp_test__';
  ls.setItem(k, '1');
  ls.removeItem(k);
} catch {
  ls = null;
}

export const storage = {
  get(key) {
    try {
      return ls ? ls.getItem(key) : memory.get(key) ?? null;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key, value) {
    try {
      if (ls) {
        ls.setItem(key, value);
        return;
      }
    } catch {
      /* fallback */
    }
    memory.set(key, value);
  },
  remove(key) {
    try {
      if (ls) {
        ls.removeItem(key);
        return;
      }
    } catch {
      /* fallback */
    }
    memory.delete(key);
  },
};
