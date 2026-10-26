import { useState, useEffect } from 'react';
import api from '../services/api';
import { SERVICES as FALLBACK_SERVICES } from '../data/items';

export default function ServicesSection() {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    async function loadServices() {
      try {
        const liveServices = await api.getServices();
        if (liveServices && liveServices.length > 0) {
          setServices(liveServices);
        }
      } catch (err) {
        // Gracefully keep fallback services if server unavailable
        console.warn('Could not fetch live services, using local data:', err.message);
      }
    }
    loadServices();
  }, []);

  return (
    <section className="py-16 sm:py-24" id="services" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-aura-accent">
            Services
          </span>
          <h2 id="services-heading" className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-aura-primary">
            What I Can Do For You
          </h2>
          <p className="mt-4 text-base sm:text-lg text-aura-secondary leading-relaxed">
            Editorial shoots, architecture documentation, fine art portraits — tailored to your
            project, timeline, and vision.
          </p>
        </div>

        {/* Services 3-Column Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {services.map((service) => (
            <article
              key={service.id}
              className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-card border transition-all duration-300 ${
                service.featured
                  ? 'bg-white border-aura-accent/50 shadow-warm-lg ring-2 ring-aura-accent/20 md:-translate-y-2'
                  : 'bg-white/80 border-black/10 hover:border-black/20 shadow-warm-sm'
              }`}
            >
              {service.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-aura-accent text-white shadow-sm">
                  {service.badge}
                </div>
              )}

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-aura-muted">
                  {service.tag}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-aura-primary">
                  {service.name}
                </h3>
                <p className="mt-3 text-aura-primary">
                  <span className="font-serif text-2xl font-bold">{service.price}</span>
                  <span className="text-xs text-aura-muted ml-1">{service.rateUnit}</span>
                </p>

                <p className="mt-4 text-sm text-aura-secondary leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-aura-secondary">
                      <span className="text-aura-accent font-bold mt-0.5" aria-hidden="true">&#10003;</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-black/5">
                <a
                  href="#book"
                  className={`block w-full py-2.5 px-4 rounded-full text-center text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    service.featured
                      ? 'bg-aura-accent text-white hover:bg-aura-accentHover shadow-warm-sm'
                      : 'bg-aura-primary text-white hover:bg-aura-accent'
                  }`}
                >
                  Commission This Package
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
