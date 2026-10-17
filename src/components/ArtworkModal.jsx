import QuantityStepper from './QuantityStepper';

export default function ArtworkModal({
  item,
  quantity = 0,
  onQuantityChange,
  onClose,
}) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-card bg-aura-surface border border-black/10 shadow-warm-lg flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent"
          aria-label="Close dialog"
        >
          &times;
        </button>

        {/* Media Preview Column */}
        <div className="w-full md:w-1/2 bg-aura-card flex items-center justify-center p-4">
          <img
            src={item.image}
            alt={item.alt}
            className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-sm"
          />
        </div>

        {/* Info & Specs Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-aura-accentLight text-aura-accent mb-3">
              {item.category} &bull; {item.location}
            </div>

            <h3 id="modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-aura-primary">
              {item.title}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-aura-secondary leading-relaxed font-sans">
              {item.description}
            </p>

            {/* Technical Specs Tags */}
            <div className="mt-6 pt-5 border-t border-black/5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-aura-muted mb-3">
                Camera &amp; Technical Specs
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.specs.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 text-xs rounded-md bg-aura-card text-aura-secondary border border-black/5"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Acquisition / Stepper Footer */}
          <div className="mt-8 pt-5 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-xs text-aura-muted uppercase tracking-wider">Archival Print</span>
              <span className="font-serif text-2xl font-bold text-aura-primary">&euro;{item.price}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-aura-secondary">Quantity:</span>
              <QuantityStepper
                value={quantity}
                onChange={onQuantityChange}
                min={0}
                max={10}
                label={`Quantity for ${item.title}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
