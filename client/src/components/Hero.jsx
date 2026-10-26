export default function Hero() {
  const metrics = [
    { value: '12+', label: 'Years Creating' },
    { value: '48', label: 'Exhibitions' },
    { value: '200+', label: 'Happy Clients' },
    { value: 'Hasselblad', label: 'Medium Format' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28" id="hero" aria-labelledby="main-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Category Pill Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aura-accentLight border border-aura-accent/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-aura-accent animate-pulse" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium tracking-wide text-aura-accent uppercase">
            Fine Art · Editorial · Architecture
          </span>
        </div>

        {/* The Single H1 Landmark */}
        <h1
          id="main-heading"
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-aura-primary max-w-4xl mx-auto leading-[1.15]"
        >
          Stories Told Through <span className="text-aura-accent italic font-normal">Light</span> &amp;{' '}
          <span className="text-aura-accent italic font-normal">Heart</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-aura-secondary max-w-2xl mx-auto leading-relaxed font-sans">
          I’m Mohammed — a photographer and visual storyteller based between Berlin and Paris.
          I capture honest moments, quiet spaces, and the kind of light that makes you stop and look twice.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-medium text-white bg-aura-accent hover:bg-aura-accentHover shadow-warm-accent transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>See My Work</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
          <a
            href="#book"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full text-base font-medium text-aura-primary bg-white/80 hover:bg-white border border-black/10 hover:border-black/20 shadow-warm-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            Let&apos;s Work Together
          </a>
        </div>

        {/* Proof Metrics Bar */}
        <div className="mt-14 sm:mt-20 max-w-4xl mx-auto pt-10 border-t border-black/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((item) => (
              <div key={item.label} className="text-center">
                <span className="block font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-aura-primary">
                  {item.value}
                </span>
                <span className="mt-1 block text-xs sm:text-sm font-medium text-aura-muted">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
