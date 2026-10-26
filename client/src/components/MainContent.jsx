import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CATEGORIES } from '../data/items';
import GalleryItem from './GalleryItem';
import ArtworkModal from './ArtworkModal';
import AddArtworkModal from './AddArtworkModal';
import AboutSection from './AboutSection';
import ServicesSection from './ServicesSection';
import BookingSection from './BookingSection';

export default function MainContent() {
  const { isAuthenticated } = useAuth();

  // Live items fetched from Express + PostgreSQL API

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // State for category filtering (Core requirement: real filter built with useState)
  const [activeCategory, setActiveCategory] = useState('All Works');

  // Stores item quantities as a dictionary: { [itemId]: number }
  const [printOrders, setPrintOrders] = useState({});

  // State for active artwork details modal
  const [selectedItem, setSelectedItem] = useState(null);

  // State for Add Artwork modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch items from the real PostgreSQL API on mount
  const fetchGalleryItems = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      setApiError(err.message || 'Failed to load portfolio items from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Callback when a new artwork is created in PostgreSQL
  const handleArtworkCreated = (newArtwork) => {
    setItems((prev) => [newArtwork, ...prev]);
  };

  // Controlled component callback: updates parent state
  const handleQuantityChange = (itemId, newQuantity) => {
    setPrintOrders((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  // Filter items based on activeCategory state using real API data
  const filteredItems = activeCategory === 'All Works'
    ? items
    : items.filter((item) => item.filterCategory === activeCategory);

  // Calculate order totals across database items
  const totalPrintsCount = Object.values(printOrders).reduce((sum, qty) => sum + qty, 0);
  const totalPrintsPrice = items.reduce((sum, item) => {
    const qty = printOrders[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  return (
    <main className="w-full overflow-hidden">
      {/* Centerpiece Image Gallery Section */}
      <section className="py-16 sm:py-24" id="gallery" aria-labelledby="gallery-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-black/5">
            <div>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-aura-accent">
                Portfolio
              </span>
              <h2 id="gallery-heading" className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-aura-primary">
                Recent Work
              </h2>
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-aura-primary hover:bg-aura-accent transition-colors shadow-warm-sm shrink-0 focus:outline-none focus:ring-2 focus:ring-aura-accent/50 self-start sm:self-auto"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add Artwork</span>
              </button>
            )}
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between text-xs sm:text-sm">
              <p>
                <strong>Database Notice:</strong> {apiError}
              </p>
              <button
                type="button"
                onClick={fetchGalleryItems}
                className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-semibold hover:bg-amber-300 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Category Filter Pills (useState-driven on live DB data) */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none" role="tablist" aria-label="Portfolio Categories">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              const count = category === 'All Works'
                ? items.length
                : items.filter((item) => item.filterCategory === category).length;

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
                  {category} {!loading && `(${count})`}
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

          {/* Loading Skeleton State */}
          {loading ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="rounded-3xl bg-black/5 h-96 animate-pulse p-6 flex flex-col justify-end">
                  <div className="h-4 bg-black/10 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-black/10 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-black/10 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Main Grid Gallery from PostgreSQL */
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
          )}

          {/* Empty state safeguard */}
          {!loading && filteredItems.length === 0 && (
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

      {/* Booking Section with Real API Order Submission */}
      <BookingSection printOrders={printOrders} items={items} />

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

      {/* Add New Artwork Modal */}
      <AddArtworkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onArtworkCreated={handleArtworkCreated}
      />
    </main>
  );
}
