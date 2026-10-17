export default function AboutSection() {
  const accolades = [
    {
      title: 'Medium',
      desc: 'Medium Format Digital & 4x5 Large Format Film',
    },
    {
      title: 'Base Studios',
      desc: 'Berlin (Kreuzberg) & Paris (Le Marais)',
    },
    {
      title: 'Represented By',
      desc: 'Galerie Monolith (Zurich / Berlin)',
    },
    {
      title: 'Availability',
      desc: 'Selected Commissions & Global Travel',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-aura-card/40 border-t border-b border-black/5" id="about" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md rounded-card overflow-hidden shadow-warm-lg border border-black/10">
              <img
                src="/assets/images/profile-pic2.webp"
                alt="Mohammed Kotbi, photographer and visual artist holding medium format camera"
                className="w-full h-auto object-cover aspect-[4/5]"
                loading="lazy"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <p className="text-xs sm:text-sm font-medium tracking-wide">
                  Mohammed Kotbi &bull; Studio Director
                </p>
              </div>
            </div>
          </div>

          {/* Bio & Accolades Column */}
          <div className="lg:col-span-7">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-aura-accent">
              About
            </span>
            <h2 id="about-heading" className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-aura-primary leading-tight">
              Every Story Deserves Good Light
            </h2>

            <div className="mt-6 space-y-4 text-base sm:text-lg text-aura-secondary leading-relaxed">
              <p>
                For me, photography is about paying attention. The way light falls across a room, a quiet
                expression, the geometry of a building at golden hour. I’m drawn to the moments that are
                easy to miss.
              </p>
              <p>
                Over the years I’ve worked with <em className="italic">Architectural Digest</em>,{' '}
                <em className="italic">Kinfolk</em>, <em className="italic">Vogue</em>, independent
                architects, and private clients. Each project is different, and that’s the part I like most.
              </p>
            </div>

            {/* Accolades 2x2 Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accolades.map((box) => (
                <div
                  key={box.title}
                  className="p-4 rounded-xl bg-white/70 border border-black/5 shadow-warm-sm"
                >
                  <span className="block text-xs font-semibold uppercase tracking-wider text-aura-muted">
                    {box.title}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-aura-primary">
                    {box.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Links */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#book"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white bg-aura-accent hover:bg-aura-accentHover shadow-warm-sm transition-colors"
              >
                Work With Me
              </a>
              <a
                href="#gallery"
                className="inline-flex items-center text-sm font-medium text-aura-primary hover:text-aura-accent transition-colors"
              >
                Browse my work &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
