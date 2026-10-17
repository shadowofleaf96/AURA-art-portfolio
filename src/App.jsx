import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-aura-base text-aura-primary flex flex-col antialiased selection:bg-aura-accent selection:text-white">
      {/* Header Landmark Component */}
      <Header />

      {/* Hero Section Component */}
      <Hero />

      {/* Main Content Component (Gallery with Filter & Controlled Steppers, About, Services, Booking) */}
      <MainContent />

      {/* Footer Landmark Component */}
      <Footer />
    </div>
  );
}
