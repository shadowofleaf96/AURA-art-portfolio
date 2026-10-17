import QuantityStepper from './QuantityStepper';

export default function GalleryItem({
  item,
  quantity = 0,
  onQuantityChange,
  onOpenDetails,
}) {
  const isWide = item.featured === 'wide';
  const hasOrder = quantity > 0;

  return (
    <article
      className={`group relative flex flex-col rounded-card overflow-hidden bg-white border transition-all duration-300 hover:shadow-warm-md ${
        isWide ? 'col-span-1 md:col-span-2' : 'col-span-1'
      } ${
        hasOrder ? 'border-aura-accent/50 ring-2 ring-aura-accent/20' : 'border-black/5 hover:border-black/10'
      }`}
    >
      {/* Clickable Image Container */}
      <div
        className="relative overflow-hidden cursor-pointer bg-aura-card"
        onClick={() => onOpenDetails(item)}
      >
        <div className={`w-full ${isWide ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3]'}`}>
          <img
            src={item.image}
            alt={item.alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        {/* Floating Category Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-aura-base/90 text-aura-primary backdrop-blur-sm border border-black/5 shadow-sm">
            {item.category}
          </span>
        </div>

        {/* Quick View Button Overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(item);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200"
          aria-label={`View details for ${item.title}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Card Content & Interactive Stepper */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 bg-white">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                onClick={() => onOpenDetails(item)}
                className="font-serif text-lg sm:text-xl font-semibold text-aura-primary hover:text-aura-accent cursor-pointer transition-colors"
              >
                {item.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-aura-muted">
                {item.location} &bull; {item.camera}
              </p>
            </div>
            <div className="text-right">
              <span className="block font-serif text-base sm:text-lg font-bold text-aura-primary">
                &euro;{item.price}
              </span>
              <span className="block text-[11px] text-aura-muted">archival print</span>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-aura-secondary line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Controlled Component Section: Print Order Stepper */}
        <div className="mt-5 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-aura-secondary">Prints:</span>
            {/* Controlled QuantityStepper component */}
            <QuantityStepper
              value={quantity}
              onChange={onQuantityChange}
              min={0}
              max={10}
              label={`Select print quantity for ${item.title}`}
            />
          </div>

          {hasOrder ? (
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-aura-accentLight text-aura-accent">
                &euro;{quantity * item.price} total
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onQuantityChange(1)}
              className="text-xs font-medium text-aura-accent hover:text-aura-accentHover underline decoration-aura-accent/30 hover:decoration-aura-accent transition-colors"
            >
              Order Print &rarr;
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
