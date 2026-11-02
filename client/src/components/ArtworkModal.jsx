import QuantityStepper from './QuantityStepper';

export default function ArtworkModal({
  item,
  quantity = 0,
  onQuantityChange,
  onClose,
  onCheckout,
  checkoutLoading = false,
}) {
  if (!item) return null;

  const currentQty = quantity > 0 ? quantity : 1;
  const totalPrice = (item.price * currentQty).toFixed(2);

  const handleBuyNow = () => {
    if (onCheckout) {
      onCheckout(item, currentQty);
    }
  };

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
          <div className="mt-8 pt-5 border-t border-black/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

            {/* Step 6: Buy Now button triggering Stripe Checkout */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={checkoutLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-semibold text-white bg-aura-accent hover:bg-aura-accentHover shadow-warm-accent transition-all duration-200 disabled:opacity-50"
            >
              {checkoutLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Connecting to Stripe Checkout...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span>Buy Now with Stripe &bull; &euro;{totalPrice}</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-aura-muted">
              Secure test payment via Stripe Checkout &bull; Test cards accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
