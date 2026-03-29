"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`
                px-6 py-4 min-w-[300px] border flex items-center justify-between gap-4
                ${toast.type === "success" ? "bg-green-50 border-green-600 text-green-800" : ""}
                ${toast.type === "error" ? "bg-red-50 border-red-600 text-red-800" : ""}
                ${toast.type === "info" ? "bg-white border-black text-black" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                {toast.type === "success" && <span className="text-green-600">✓</span>}
                {toast.type === "error" && <span className="text-red-600">✕</span>}
                {toast.type === "info" && <span className="text-black">ℹ</span>}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-black/40 hover:text-black"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}


