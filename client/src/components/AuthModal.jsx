import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (authModalOpen) {
      setError(null);
    }
  }, [authModalOpen, authModalMode]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (authModalMode === 'signin') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setAuthModalMode('signin');
    setEmail('demo@auragallery.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md bg-aura-card border border-black/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-aura-accent">
              AURA Account
            </span>
            <h2 id="auth-modal-title" className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-aura-primary">
              {authModalMode === 'signin' ? 'Welcome Back' : 'Join Collector Circle'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-2 rounded-full text-aura-secondary hover:text-aura-primary hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent/40"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex border-b border-black/10">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signin');
              setError(null);
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
              authModalMode === 'signin'
                ? 'border-aura-accent text-aura-primary'
                : 'border-transparent text-aura-muted hover:text-aura-secondary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('signup');
              setError(null);
            }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors border-b-2 ${
              authModalMode === 'signup'
                ? 'border-aura-accent text-aura-primary'
                : 'border-transparent text-aura-muted hover:text-aura-secondary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm animate-fadeIn">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary placeholder-aura-muted text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary placeholder-aura-muted text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary placeholder-aura-muted text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
            />
            {authModalMode === 'signup' && (
              <p className="mt-1 text-xs text-aura-muted">Must be at least 6 characters.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-full bg-aura-primary text-white text-sm font-semibold hover:bg-aura-accent transition-colors shadow-warm-sm hover:shadow-warm-md flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing...
              </span>
            ) : authModalMode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Demo Account Helper */}
        <div className="mt-6 pt-5 border-t border-black/10 text-center">
          <p className="text-xs text-aura-secondary">Testing for assessment?</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="mt-1 text-xs font-semibold text-aura-accent hover:underline focus:outline-none"
          >
            Click here to auto-fill Demo Account (demo@auragallery.com)
          </button>
        </div>
      </div>
    </div>
  );
}
