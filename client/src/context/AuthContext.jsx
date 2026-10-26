import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'aura_auth_token';

export function AuthProvider({ children }) {
  const { showSuccess, showInfo } = useToast();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' | 'signup'

  // Restore session on initial load or page refresh
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe(storedToken);
        if (response && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem(STORAGE_TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Session restoration failed or expired:', err.message);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem(STORAGE_TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      showSuccess(
        'Connected Successfully',
        `Welcome back, ${res.user.name || 'Collector'}! You are now logged in.`
      );
      return res.user;
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    const res = await api.signup({ name, email, password });
    if (res.token && res.user) {
      localStorage.setItem(STORAGE_TOKEN_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      showSuccess(
        'Welcome to AURA!',
        `Account created successfully. Welcome, ${res.user.name}!`
      );
      return res.user;
    }
  };

  // Logout handler
  const logout = () => {
    const previousName = user?.name;
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setToken(null);
    setUser(null);
    showInfo(
      'Disconnected',
      previousName ? `Goodbye, ${previousName}. You have been signed out.` : 'You have been signed out.'
    );
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        authModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
