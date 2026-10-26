import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

// Individual Toast Notification Item
function ToastItem({ toast, onDismiss }) {
  const { id, type = 'success', title, message, duration = 4000 } = toast;
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);
  const [startTime, setStartTime] = useState(() => Date.now());

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      onDismiss(id);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [id, isPaused, remainingTime, onDismiss]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    const elapsed = Date.now() - startTime;
    setRemainingTime((prev) => Math.max(0, prev - elapsed));
  };

  const handleMouseLeave = () => {
    setStartTime(Date.now());
    setIsPaused(false);
  };

  // Luxury visual accents per toast type
  const typeStyles = {
    success: {
      badgeBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20',
      progressBar: 'bg-emerald-600',
      borderAccent: 'border-l-4 border-l-emerald-600',
    },
    error: {
      badgeBg: 'bg-red-500/15 text-red-700 border-red-500/20',
      progressBar: 'bg-red-600',
      borderAccent: 'border-l-4 border-l-red-600',
    },
    info: {
      badgeBg: 'bg-aura-accent/15 text-aura-accent border-aura-accent/20',
      progressBar: 'bg-aura-accent',
      borderAccent: 'border-l-4 border-l-aura-accent',
    },
    warning: {
      badgeBg: 'bg-amber-500/15 text-amber-700 border-amber-500/20',
      progressBar: 'bg-amber-600',
      borderAccent: 'border-l-4 border-l-amber-600',
    },
  };

  const currentStyle = typeStyles[type] || typeStyles.success;

  return (
    <div
      id={`toast-item-${id}`}
      data-toast-type={type}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-aura-surface/95 backdrop-blur-md border border-black/10 shadow-warm-lg p-4 transition-all duration-300 animate-toast-enter flex items-start gap-3.5 group ${currentStyle.borderAccent}`}
    >
      {/* Toast Icon Badge */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${currentStyle.badgeBg}`}
        aria-hidden="true"
      >
        {type === 'success' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        )}
        {type === 'info' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        )}
        {type === 'warning' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
      </div>

      {/* Title & Body */}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="font-serif font-semibold text-sm text-aura-primary leading-tight">
          {title}
        </h4>
        {message && (
          <p className="mt-1 text-xs text-aura-secondary leading-relaxed break-words">
            {message}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="shrink-0 p-1.5 rounded-lg text-aura-muted hover:text-aura-primary hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent/40"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Dynamic Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <div
          className={`h-full ${currentStyle.progressBar}`}
          style={{
            animation: `toastProgress ${duration}ms linear forwards`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  );
}

// Fixed Toast Container
function ToastContainer({ toasts, onDismiss }) {
  if (typeof document === 'undefined' || toasts.length === 0) return null;

  return createPortal(
    <div
      id="toast-container"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none w-[calc(100vw-2.5rem)] max-w-sm sm:w-96"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'success', title, message, duration = 4000 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const showSuccess = useCallback(
    (title, message, duration = 4000) => {
      return addToast({ type: 'success', title, message, duration });
    },
    [addToast]
  );

  const showError = useCallback(
    (title, message, duration = 5000) => {
      return addToast({ type: 'error', title, message, duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (title, message, duration = 4000) => {
      return addToast({ type: 'info', title, message, duration });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (title, message, duration = 4500) => {
      return addToast({ type: 'warning', title, message, duration });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        removeToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
