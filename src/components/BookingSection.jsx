import { useState } from 'react';

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    shootType: 'editorial',
    date: '',
    location: '',
    budget: '',
    vision: '',
    consent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.vision || !formData.consent) {
      return;
    }
    // Simulation of form processing (pure React, no backend needed for Week 2)
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      shootType: 'editorial',
      date: '',
      location: '',
      budget: '',
      vision: '',
      consent: false,
    });
    setIsSubmitted(false);
  };

  const benefits = [
    {
      title: 'Personal Response',
      desc: 'I reply personally within 24 hours — no assistants, no auto-replies.',
    },
    {
      title: 'Location Flexible',
      desc: 'Based in Berlin & Paris, but happy to travel wherever the project is.',
    },
    {
      title: 'Archival Prints',
      desc: 'Fine prints on museum-grade cotton rag paper, built to last.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-aura-card/30 border-t border-black/5" id="book" aria-labelledby="booking-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Information & Contacts */}
          <div className="lg:col-span-5">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-aura-accent">
              Contact
            </span>
            <h2 id="booking-heading" className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-aura-primary leading-tight">
              Have a Project in Mind?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-aura-secondary leading-relaxed">
              Tell me a bit about what you’re thinking — a magazine shoot, an architecture project,
              a portrait session, or something else entirely. I’ll get back to you with ideas and availability.
            </p>

            {/* Benefits List */}
            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3.5">
                  <span className="w-5 h-5 rounded-full bg-aura-accent/10 text-aura-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    &#10003;
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-aura-primary">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm text-aura-secondary mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Studio Contacts Card */}
            <div className="mt-8 p-6 rounded-card bg-white border border-black/5 shadow-warm-sm space-y-2.5 text-xs sm:text-sm">
              <h4 className="font-serif text-base font-bold text-aura-primary mb-2">Direct Studio Contacts</h4>
              <p className="text-aura-secondary">
                <strong className="text-aura-primary">Berlin Studio:</strong> Paul-Lincke-Ufer 44, 10999 Berlin
              </p>
              <p className="text-aura-secondary">
                <strong className="text-aura-primary">Paris Studio:</strong> 18 Rue Vieille-du-Temple, 75004 Paris
              </p>
              <p className="text-aura-secondary">
                <strong className="text-aura-primary">Inquiries:</strong>{' '}
                <a href="mailto:contact@auraportfolio.art" className="text-aura-accent hover:underline">
                  contact@auraportfolio.art
                </a>
              </p>
              <p className="text-aura-secondary">
                <strong className="text-aura-primary">Direct Phone:</strong>{' '}
                <a href="tel:+493012345678" className="text-aura-accent hover:underline">
                  +49 30 1234 5678
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: React Controlled Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-card bg-white border border-black/10 shadow-warm-md">
              {isSubmitted ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-14 h-14 mx-auto rounded-full bg-aura-success/15 text-aura-success flex items-center justify-center text-2xl font-bold mb-4">
                    &#10003;
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-aura-primary">
                    Inquiry Received
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-aura-secondary max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-aura-primary">{formData.name}</strong>. I’ve received your message regarding{' '}
                    <strong className="text-aura-accent">{formData.shootType}</strong> and will get back to you within 24 hours at{' '}
                    <strong className="text-aura-primary">{formData.email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold bg-aura-primary text-white hover:bg-aura-accent transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-aura-primary">Project Details</h3>
                    <p className="text-xs sm:text-sm text-aura-muted mt-1">
                      Share what you have in mind. No commitment — I’ll follow up with a quote and ideas.
                    </p>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-aura-primary mb-1">
                        Full Name <span className="text-aura-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Julian Weber"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-aura-primary mb-1">
                        Email Address <span className="text-aura-accent">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="julian@example.com"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-aura-primary mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+49 170 0000000"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-aura-primary mb-1">
                        Company / Publication
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Studio / Agency / Private"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Shoot Category Radio Pills */}
                  <div>
                    <label className="block text-xs font-semibold text-aura-primary mb-2">
                      Shoot Category <span className="text-aura-accent">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'editorial', label: 'Editorial' },
                        { id: 'architecture', label: 'Architecture' },
                        { id: 'portrait', label: 'Fine Portrait' },
                        { id: 'print', label: 'Print Acquisition' },
                      ].map((type) => (
                        <label
                          key={type.id}
                          className={`flex items-center justify-center p-2.5 rounded-xl text-xs font-medium cursor-pointer border transition-colors ${
                            formData.shootType === type.id
                              ? 'bg-aura-accent text-white border-aura-accent shadow-sm'
                              : 'bg-aura-base/50 text-aura-secondary border-black/10 hover:bg-aura-base'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shootType"
                            value={type.id}
                            checked={formData.shootType === type.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span>{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date & Location Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-xs font-semibold text-aura-primary mb-1">
                        Preferred Date / Month
                      </label>
                      <input
                        type="text"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="e.g. November 2026 or ASAP"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-xs font-semibold text-aura-primary mb-1">
                        Shoot Location / City
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Berlin Studio or On Location"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Budget Dropdown */}
                  <div>
                    <label htmlFor="budget" className="block text-xs font-semibold text-aura-primary mb-1">
                      Estimated Budget (EUR)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors text-aura-primary"
                    >
                      <option value="">Select estimated budget bracket</option>
                      <option value="1500-3000">&euro;1,500 &ndash; &euro;3,000</option>
                      <option value="3000-6000">&euro;3,000 &ndash; &euro;6,000</option>
                      <option value="6000-12000">&euro;6,000 &ndash; &euro;12,000</option>
                      <option value="12000+">&euro;12,000+ (Comprehensive Campaign)</option>
                    </select>
                  </div>

                  {/* Message / Project Vision */}
                  <div>
                    <label htmlFor="vision" className="block text-xs font-semibold text-aura-primary mb-1">
                      Project Vision &amp; Requirements <span className="text-aura-accent">*</span>
                    </label>
                    <textarea
                      id="vision"
                      name="vision"
                      rows={4}
                      value={formData.vision}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your creative concept, mood references, expected deliverables, or timeline constraints..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-black/15 bg-aura-base/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-colors resize-y"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="mt-1 h-4 w-4 rounded border-black/20 text-aura-accent focus:ring-aura-accent"
                    />
                    <label htmlFor="consent" className="text-xs text-aura-secondary leading-snug">
                      I agree to the privacy policy and consent to Mohammed Kotbi studio contacting me regarding this shoot inquiry.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold text-white bg-aura-accent hover:bg-aura-accentHover shadow-warm-accent transition-all duration-200"
                    >
                      <span>Send Inquiry</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                    <p className="mt-2 text-center text-[11px] text-aura-muted">
                      Your message goes directly to me. No spam, no mailing lists.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
