// src/context/ToastContext.jsx
import { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ id: Date.now(), message });
    setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-black/90 px-4 py-3 text-sm text-white border border-violet-500/50">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}