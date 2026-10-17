import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-aura-base/90 backdrop-blur-md border-b border-black/5" id="top">
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
            <a
              href="#book"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-aura-primary hover:bg-aura-accent transition-colors duration-200 shadow-warm-sm hover:shadow-warm-md"
            >
              Book a Shoot
            </a>
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
            <div className="pt-2">
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
