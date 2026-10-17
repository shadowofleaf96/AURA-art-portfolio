import { useState } from 'react';
import { CATEGORIES, GALLERY_ITEMS } from '../data/items';
import GalleryItem from './GalleryItem';
import ArtworkModal from './ArtworkModal';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import BookingSection from './BookingSection';

export default function MainContent() {
  // State for category filtering (Core requirement: real filter built with useState)
  const [activeCategory, setActiveCategory] = useState('All Works');

  // State for controlled component QuantityStepper across items
  // Stores item quantities as a dictionary: { [itemId]: number }
  const [printOrders, setPrintOrders] = useState({});

  // State for active artwork details modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Controlled component callback: updates parent state
  const handleQuantityChange = (itemId, newQuantity) => {
    setPrintOrders((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  // Filter items based on activeCategory state
  const filteredItems = activeCategory === 'All Works'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.filterCategory === activeCategory);

  // Calculate order totals
  const totalPrintsCount = Object.values(printOrders).reduce((sum, qty) => sum + qty, 0);
  const totalPrintsPrice = GALLERY_ITEMS.reduce((sum, item) => {
    const qty = printOrders[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  return (
    <main className="w-full overflow-hidden">
      {/* Centerpiece Image Gallery Section */}
      <section className="py-16 sm:py-24" id="gallery" aria-labelledby="gallery-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
            <div>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-aura-accent">
                Portfolio
              </span>
              <h2 id="gallery-heading" className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-aura-primary">
                Recent Work
              </h2>
            </div>
            <p className="text-sm sm:text-base text-aura-secondary max-w-md">
              A mix of what I’ve been working on lately — architecture, portraits, editorials,
              and the in-between moments.
            </p>
          </div>

          {/* Category Filter Pills (useState-driven) */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none" role="tablist" aria-label="Portfolio Categories">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const count = category === 'All Works'
                ? GALLERY_ITEMS.length
                : GALLERY_ITEMS.filter((item) => item.filterCategory === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-aura-accent/40 ${
                    isActive
                      ? 'bg-aura-primary text-white shadow-warm-sm'
                      : 'bg-white text-aura-secondary hover:text-aura-primary hover:bg-black/5 border border-black/5'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>

          {/* Active Order Summary Banner if user has selected prints via controlled steppers */}
          {totalPrintsCount > 0 && (
            <div className="mt-6 p-4 rounded-card bg-aura-accent/10 border border-aura-accent/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-aura-accent text-white font-bold flex items-center justify-center text-xs">
                  {totalPrintsCount}
                </span>
                <p className="text-xs sm:text-sm text-aura-primary font-medium">
                  <strong>{totalPrintsCount} {totalPrintsCount === 1 ? 'archival print' : 'archival prints'}</strong> selected across your collection (&euro;{totalPrintsPrice} total).
                </p>
              </div>
              <a
                href="#book"
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-aura-accent text-white hover:bg-aura-accentHover shadow-sm transition-colors"
              >
                Inquire &amp; Order &rarr;
              </a>
            </div>
          )}

          {/* Main Grid Gallery */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <GalleryItem
                key={item.id}
                item={item}
                quantity={printOrders[item.id] || 0}
                onQuantityChange={(newQty) => handleQuantityChange(item.id, newQty)}
                onOpenDetails={(itemToView) => setSelectedItem(itemToView)}
              />
            ))}
          </div>

          {/* Empty state safeguard */}
          {filteredItems.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-base text-aura-muted">No works found in this category.</p>
              <button
                type="button"
                onClick={() => setActiveCategory('All Works')}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-aura-primary text-white"
              >
                Show All Works
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Booking Section */}
      <BookingSection />

      {/* Lightbox / Artwork Details Modal */}
      <ArtworkModal
        item={selectedItem}
        quantity={selectedItem ? printOrders[selectedItem.id] || 0 : 0}
        onQuantityChange={(newQty) => {
          if (selectedItem) {
            handleQuantityChange(selectedItem.id, newQty);
          }
        }}
        onClose={() => setSelectedItem(null)}
      />
    </main>
  );
}
