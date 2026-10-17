export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-aura-card border-t border-black/10 py-16 text-aura-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-black/5">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <a
              href="#top"
              className="inline-flex items-center gap-3 group focus:outline-none"
              aria-label="AURA Photography - Back to top"
            >
              <span
                className="w-10 h-10 rounded-full bg-aura-accent text-white font-serif font-bold text-lg flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform"
                aria-hidden="true"
              >
                A
              </span>
              <span className="font-serif font-semibold text-2xl tracking-wider text-aura-primary">
                AURA<span className="text-aura-accent">.</span>
              </span>
            </a>
            <p className="mt-4 text-xs sm:text-sm text-aura-muted max-w-sm leading-relaxed">
              Fine art, architectural minimalism, and editorial photography by Mohammed Kotbi.
              All works protected under international copyright.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-aura-primary mb-3">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#hero" className="hover:text-aura-accent transition-colors">Overview</a></li>
                <li><a href="#gallery" className="hover:text-aura-accent transition-colors">Selected Works</a></li>
                <li><a href="#about" className="hover:text-aura-accent transition-colors">The Artist</a></li>
                <li><a href="#services" className="hover:text-aura-accent transition-colors">Services &amp; Rates</a></li>
                <li><a href="#book" className="hover:text-aura-accent transition-colors">Book a Shoot</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-aura-primary mb-3">
                Galleries
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#gallery" className="hover:text-aura-accent transition-colors">Monolith in Ochre</a></li>
                <li><a href="#gallery" className="hover:text-aura-accent transition-colors">Vogue Italia Editorial</a></li>
                <li><a href="#gallery" className="hover:text-aura-accent transition-colors">Sanctuary Rays (DK)</a></li>
                <li><a href="#gallery" className="hover:text-aura-accent transition-colors">Aegean Textures (GR)</a></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-aura-primary mb-3">
                Connect
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-aura-accent transition-colors">
                    Instagram &nearr;
                  </a>
                </li>
                <li>
                  <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:text-aura-accent transition-colors">
                    Behance &nearr;
                  </a>
                </li>
                <li>
                  <a href="https://vsco.co" target="_blank" rel="noopener noreferrer" className="hover:text-aura-accent transition-colors">
                    VSCO Journal &nearr;
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@auraportfolio.art" className="hover:text-aura-accent transition-colors">
                    Email Studio
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-aura-muted">
          <p>
            &copy; 2026 Mohammed Kotbi &bull; AURA Photography. All Rights Reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-aura-primary transition-colors focus:outline-none"
            aria-label="Scroll back to top of page"
          >
            <span>Back to Top</span>
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
