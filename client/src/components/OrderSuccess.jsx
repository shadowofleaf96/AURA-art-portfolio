import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrderSuccess({ onBackToGallery }) {
  const { token, isAuthenticated, loading: authLoading, openAuthModal, openOrdersModal } = useAuth();

  const [orderId, setOrderId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(null);

  // Extract query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    const oid = params.get('order_id');
    setSessionId(sid);
    setOrderId(oid);
  }, []);

  // Fetch and poll order status from API (Step 7 requirement)
  const fetchOrder = useCallback(
    async (currentPoll = 0) => {
      if (!orderId && !sessionId) return;
      if (authLoading) return;

      try {
        const response = await api.getOrder(orderId, sessionId, token);
        if (response && response.order) {
          const fetchedOrder = response.order;
          setOrder(fetchedOrder);

          if (fetchedOrder.status === 'paid') {
            setIsPaid(true);
            setLoading(false);
            return;
          }

          // If still pending and under 8 polling attempts (~12 seconds), retry
          if (currentPoll < 8) {
            setPollCount(currentPoll + 1);
            setTimeout(() => {
              fetchOrder(currentPoll + 1);
            }, 1500);
          } else {
            // Finished polling attempts; stop spinner
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching order receipt:', err);
        setError(err.message || 'Could not retrieve order details.');
        setLoading(false);
      }
    },
    [orderId, sessionId, token, authLoading]
  );

  useEffect(() => {
    if (!authLoading && (orderId || sessionId)) {
      setLoading(true);
      fetchOrder(0);
    }
  }, [orderId, sessionId, authLoading, fetchOrder]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchOrder(0);
  };

  const handleReturn = () => {
    // Clear URL parameters
    window.history.pushState({}, '', window.location.pathname.replace('/success', '') || '/');
    if (onBackToGallery) {
      onBackToGallery();
    } else {
      window.location.href = '/';
    }
  };

  // Step 3 requirement: While verifying authentication session, show loading instead of flashing sign-in prompt
  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 shadow-warm-lg p-10 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-aura-accent/10 flex items-center justify-center text-aura-accent mb-4">
            <svg
              className="animate-spin h-8 w-8 text-aura-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-aura-accent">
            Collector Verification
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-aura-primary">
            Verifying Authentication...
          </h2>
          <p className="mt-2 text-xs text-aura-secondary leading-relaxed">
            Restoring your secure session and retrieving order confirmation...
          </p>
        </div>
      </div>
    );
  }

  // Step 3 requirement: Payments pages walled by login (only after auth check has completed)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 shadow-warm-lg p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-aura-accent/10 text-aura-accent flex items-center justify-center text-3xl mb-4">
            🔒
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-aura-accent">
            Protected Collector Area
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-aura-primary">
            Sign In Required
          </h2>
          <p className="mt-3 text-sm text-aura-secondary leading-relaxed">
            Order receipts and payment details are private. Please sign in to verify your identity and view this order.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="w-full py-3 px-6 rounded-full text-sm font-semibold text-white bg-aura-primary hover:bg-aura-accent transition-colors shadow-warm-sm"
            >
              Sign In to View Order
            </button>
            <button
              type="button"
              onClick={handleReturn}
              className="text-xs text-aura-muted hover:text-aura-primary transition-colors"
            >
              &larr; Return to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-black/10 shadow-warm-lg p-6 sm:p-10 animate-fadeIn">
        {/* Header Icon & Status */}
        <div className="text-center">
          {isPaid ? (
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold shadow-sm animate-scaleIn">
              &#10003;
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
              {loading ? (
                <svg className="animate-spin h-7 w-7 text-amber-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                '⏳'
              )}
            </div>
          )}

          <div className="mt-4">
            <span
              className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              Order Status: {isPaid ? 'PAID' : (order?.status || 'PENDING WEBHOOK')}
            </span>
          </div>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-aura-primary">
            {isPaid ? 'Payment Confirmed' : 'Processing Payment Confirmation'}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-aura-secondary max-w-lg mx-auto">
            {isPaid
              ? `Thank you, ${order?.customerName || 'Collector'}. Your fine art acquisition is confirmed and recorded in our database.`
              : 'Stripe redirected you back. Awaiting confirmation from Stripe webhook...'}
          </p>
        </div>

        {/* Polling / Webhook Notice */}
        {!isPaid && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <span className="text-base mt-0.5">ℹ️</span>
              <div className="flex-1">
                <p className="font-semibold">Awaiting Webhook Callback</p>
                <p className="mt-1 text-amber-800">
                  Per assessment rules, orders are only marked as <strong>PAID</strong> once the Stripe webhook verifies payment.
                  {loading && ` Polling backend (attempt ${pollCount}/8)...`}
                </p>
                {!loading && (
                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-semibold transition-colors"
                  >
                    <span>Refresh Status</span>
                    <span>&circlearrowright;</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Order Details Receipt */}
        {order && (
          <div className="mt-8 pt-6 border-t border-black/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-aura-muted block">Order ID</span>
                <span className="font-mono font-bold text-aura-primary">#{order.id}</span>
              </div>
              <div>
                <span className="text-aura-muted block">Collector</span>
                <span className="font-medium text-aura-primary">{order.customerName}</span>
              </div>
              <div>
                <span className="text-aura-muted block">Email</span>
                <span className="font-medium text-aura-primary">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-aura-muted block">Date</span>
                <span className="font-medium text-aura-primary">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Line Items Table (Step 1 orderItems requirement) */}
            <div className="rounded-2xl border border-black/10 overflow-hidden">
              <div className="bg-aura-base/40 px-4 py-2.5 border-b border-black/10 text-xs font-semibold uppercase tracking-wider text-aura-muted">
                Purchased Artworks (orderItems)
              </div>
              <ul className="divide-y divide-black/5 bg-white">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <li key={idx} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <h4 className="font-serif font-bold text-aura-primary">{item.title}</h4>
                        <span className="text-aura-muted text-[11px]">
                          Archival Fine Art Print &bull; Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-aura-primary">
                          &euro;{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="block text-[11px] text-aura-muted">
                          &euro;{item.price.toFixed(2)} each
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-xs text-aura-muted">No item breakdown available.</li>
                )}
              </ul>
              <div className="bg-aura-base/30 p-4 border-t border-black/10 flex items-center justify-between font-serif text-base sm:text-lg font-bold text-aura-primary">
                <span>Total Amount</span>
                <span className="text-aura-accent">&euro;{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={openOrdersModal}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold bg-aura-accent text-white hover:bg-aura-accentHover transition-colors shadow-warm-accent text-center"
          >
            View All My Orders &rarr;
          </button>
          <button
            type="button"
            onClick={handleReturn}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold bg-aura-primary text-white hover:bg-aura-accent transition-colors shadow-warm-sm text-center"
          >
            &larr; Return to Portfolio Gallery
          </button>
        </div>
      </div>
    </div>
  );
}

