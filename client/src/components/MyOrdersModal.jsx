import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MyOrdersModal({ isOpen, onClose }) {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && token) {
      fetchOrders();
    }
  }, [isOpen, isAuthenticated, token]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMyOrders(token);
      setOrders(res || []);
    } catch (err) {
      console.error('Failed to load user orders:', err);
      setError(err.message || 'Could not retrieve your orders.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-orders-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-3xl border border-black/10 shadow-warm-lg overflow-hidden animate-scaleIn">
        {/* Modal Header */}
        <div className="px-6 py-5 sm:px-8 border-b border-black/10 flex items-center justify-between bg-aura-base/40">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-aura-accent">
              Collector History
            </span>
            <h3 id="my-orders-title" className="font-serif text-2xl font-bold text-aura-primary">
              My Orders &amp; Receipts
            </h3>
            <p className="text-xs text-aura-muted mt-0.5">
              Account: <strong className="text-aura-secondary">{user?.email}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 text-aura-secondary hover:text-aura-primary flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent"
            aria-label="Close orders modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body / Scroll Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-black/5 bg-black/5 animate-pulse space-y-3">
                  <div className="h-4 bg-black/10 rounded w-1/3"></div>
                  <div className="h-6 bg-black/10 rounded w-2/3"></div>
                  <div className="h-4 bg-black/10 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between">
              <p>
                <strong>Error:</strong> {error}
              </p>
              <button
                type="button"
                onClick={fetchOrders}
                className="px-3 py-1 rounded-full bg-red-200 hover:bg-red-300 text-red-900 text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-aura-card flex items-center justify-center text-2xl mb-3">
                📦
              </div>
              <h4 className="font-serif text-lg font-bold text-aura-primary">No Purchases Yet</h4>
              <p className="mt-1 text-xs sm:text-sm text-aura-muted max-w-sm mx-auto">
                You haven&apos;t placed any fine art print acquisitions yet. Browse the portfolio to collect limited edition archival prints.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-6 py-2 rounded-full text-xs font-semibold text-white bg-aura-primary hover:bg-aura-accent transition-colors"
              >
                Explore Works
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const isPaid = order.status === 'paid';
                return (
                  <article
                    key={order.id}
                    className="p-5 rounded-2xl border border-black/10 bg-white shadow-sm space-y-4 hover:border-black/20 transition-colors"
                  >
                    {/* Order Item Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs sm:text-sm text-aura-primary">
                          Order #{order.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {isPaid ? '✓ PAID' : '⏳ PENDING'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-base sm:text-lg font-bold text-aura-primary">
                          &euro;{order.totalPrice ? Number(order.totalPrice).toFixed(2) : '0.00'}
                        </span>
                        <span className="block text-[10px] text-aura-muted">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Order Line Items (orderItems) */}
                    <div className="space-y-1.5 text-xs text-aura-secondary">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1">
                            <span className="font-medium text-aura-primary">
                              &bull; {item.title}{' '}
                              <span className="text-aura-muted font-normal">
                                &times; {item.quantity}
                              </span>
                            </span>
                            <span className="text-aura-primary font-semibold">
                              &euro;{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-aura-muted italic">Inquiry booking</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-aura-base/30 border-t border-black/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-aura-primary text-white hover:bg-aura-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
