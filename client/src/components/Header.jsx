import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const navLinks = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-aura-base/95 backdrop-blur-md border-b border-black/5 shadow-warm-sm transition-all" id="top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo / Monogram */}
          <a
            href="#top"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-aura-accent/50 rounded-lg p-1"
            aria-label="AURA Photography - Back to top"
          >
            <span
              className="w-10 h-10 rounded-full bg-aura-accent text-white font-serif font-bold text-lg flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform duration-200"
              aria-hidden="true"
            >
              A
            </span>
            <span className="font-serif font-semibold text-2xl tracking-wider text-aura-primary">
              AURA<span className="text-aura-accent">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary desktop navigation">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-aura-secondary hover:text-aura-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Authentication Buttons (Signed in vs Signed out) */}
            <div className="flex items-center gap-3 pl-4 border-l border-black/10">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 border border-black/5 text-xs font-medium text-aura-primary">
                    <span className="w-6 h-6 rounded-full bg-aura-accent text-white flex items-center justify-center font-bold text-[10px] uppercase">
                      {user.name ? user.name[0] : 'U'}
                    </span>
                    <span className="truncate max-w-[130px] font-semibold">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    id="header-signout-btn"
                    onClick={logout}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full text-aura-secondary hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="header-signin-btn"
                  onClick={() => openAuthModal('signin')}
                  className="text-sm font-semibold text-aura-primary hover:text-aura-accent px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent/40 rounded-lg"
                >
                  Sign In
                </button>
              )}

              <a
                href="#book"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-aura-primary hover:bg-aura-accent transition-colors duration-200 shadow-warm-sm hover:shadow-warm-md"
              >
                Book a Shoot
              </a>
            </div>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-xl text-aura-primary hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent/40"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden py-4 border-t border-black/5 space-y-2 animate-fadeIn"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-aura-secondary hover:text-aura-accent hover:bg-black/5 transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Auth Status */}
            <div className="pt-3 border-t border-black/5 space-y-2">
              {isAuthenticated ? (
                <div className="p-3 bg-black/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-aura-accent text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.name ? user.name[0] : 'U'}
                    </span>
                    <span className="text-sm font-semibold text-aura-primary truncate max-w-[150px]">
                      {user.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold text-aura-primary bg-black/5 hover:bg-black/10 transition-colors"
                >
                  Sign In / Register
                </button>
              )}

              <a
                href="#book"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-full text-sm font-medium text-white bg-aura-accent hover:bg-aura-accentHover transition-colors shadow-warm-sm"
              >
                Book a Shoot
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
