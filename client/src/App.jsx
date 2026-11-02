import { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import OrderSuccess from './components/OrderSuccess';
import MyOrdersModal from './components/MyOrdersModal';

function MainApp() {
  const { ordersModalOpen, closeOrdersModal } = useAuth();

  const [isSuccessView, setIsSuccessView] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.has('session_id') ||
      params.has('order_id') ||
      window.location.pathname.endsWith('/success')
    );
  });

  // Watch for popstate or navigation back
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setIsSuccessView(
        params.has('session_id') ||
        params.has('order_id') ||
        window.location.pathname.endsWith('/success')
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-aura-base text-aura-primary flex flex-col antialiased selection:bg-aura-accent selection:text-white">
      {/* Header Landmark Component with Auth State & Orders Trigger */}
      <Header />

      {isSuccessView ? (
        /* Assignment 4 Step 7: Success Page confirms payment through webhook */
        <OrderSuccess onBackToGallery={() => setIsSuccessView(false)} />
      ) : (
        <>
          {/* Hero Section Component */}
          <Hero />

          {/* Main Content Component (Gallery with Filter & Controlled Steppers, About, Services, Booking) */}
          <MainContent />
        </>
      )}

      {/* Footer Landmark Component */}
      <Footer />

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* My Orders Modal (User Order History) */}
      <MyOrdersModal isOpen={ordersModalOpen} onClose={closeOrdersModal} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
