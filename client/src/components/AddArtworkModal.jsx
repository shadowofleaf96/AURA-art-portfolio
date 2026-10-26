import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const IMAGE_PRESETS = [
  { label: 'Minimalist Architecture', path: '/assets/images/architecture-minimal.jpg' },
  { label: 'Editorial Fashion Portrait', path: '/assets/images/editorial-portrait.jpg' },
  { label: 'Alpine Golden Landscape', path: '/assets/images/golden-landscape.jpg' },
  { label: 'Botanical Fine Art Macro', path: '/assets/images/botanical-fineart.jpg' },
  { label: 'Monochromatic Studio Noir', path: '/assets/images/studio-portrait.jpg' },
  { label: 'Aerial Oceanic Indigo', path: '/assets/images/ocean-aerial.jpg' },
  { label: 'Sacred Sanctuary Light', path: '/assets/images/interior-light.jpg' },
  { label: 'Street Atmosphere Noir', path: '/assets/images/street-noir.jpg' },
];

export default function AddArtworkModal({ isOpen, onClose, onArtworkCreated }) {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Architecture',
    price: 450,
    edition: 'Limited Edition of 12',
    location: 'Kyoto, Japan',
    camera: 'Hasselblad 907X • 45mm',
    featured: 'standard',
    image: IMAGE_PRESETS[0].path,
    customImage: '',
    specs: 'Medium Format, f/4.0, 1/250s, ISO 64',
    description: '',
  });

  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a title for the artwork.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const activeImage = useCustomUrl && formData.customImage.trim() 
      ? formData.customImage.trim() 
      : formData.image;

    const specsArray = formData.specs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        filterCategory: formData.category,
        price: Number(formData.price) || 350,
        edition: formData.edition.trim() || 'Curated Fine Art Print',
        location: formData.location.trim() || 'Studio Series',
        camera: formData.camera.trim() || 'Medium Format',
        featured: formData.featured,
        image: activeImage,
        alt: `${formData.title} fine art photography print`,
        specs: specsArray.length > 0 ? specsArray : ['Medium Format', 'Archival Rag Paper'],
        description: formData.description.trim() || `Original fine art print titled "${formData.title}".`,
      };

      const newArtwork = await api.createItem(payload, token);
      if (onArtworkCreated) {
        onArtworkCreated(newArtwork);
      }
      onClose();
    } catch (err) {
      console.error('Error creating artwork:', err);
      setError(err.message || 'Failed to save artwork to database.');
    } finally {
      setSubmitting(false);
    }
  };

  const activePreviewImage = useCustomUrl && formData.customImage.trim() 
    ? formData.customImage.trim() 
    : formData.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-artwork-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-aura-card border border-black/10 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-4 border-b border-black/10 flex items-start justify-between bg-aura-surface">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-aura-accent">
              Curatorial Studio
            </span>
            <h2 id="add-artwork-modal-title" className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-aura-primary">
              Add New Artwork
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-aura-secondary hover:text-aura-primary hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-accent/40"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm animate-fadeIn">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Artwork Title <span className="text-aura-accent">*</span>
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Monolith in Ochre"
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary placeholder-aura-muted text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Portfolio Category <span className="text-aura-accent">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              >
                <option value="Architecture">Architecture</option>
                <option value="Editorial & Fashion">Editorial &amp; Fashion</option>
                <option value="Atmosphere & Nature">Atmosphere &amp; Nature</option>
                <option value="Studio Mono">Studio Mono</option>
              </select>
            </div>
          </div>

          {/* Price, Edition & Layout Span */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Print Price (&euro;) <span className="text-aura-accent">*</span>
              </label>
              <input
                type="number"
                min="50"
                step="10"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Edition Details
              </label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                placeholder="e.g. Limited Edition of 10"
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Grid Card Format
              </label>
              <select
                name="featured"
                value={formData.featured}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              >
                <option value="standard">Standard (Square)</option>
                <option value="wide">Wide Span (Panoramic)</option>
                <option value="tall">Tall Span (Portrait)</option>
              </select>
            </div>
          </div>

          {/* Location & Camera Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Valencia, Spain"
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
                Camera Gear &amp; Lens
              </label>
              <input
                type="text"
                name="camera"
                value={formData.camera}
                onChange={handleChange}
                placeholder="e.g. Hasselblad H6D • 50mm"
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            </div>
          </div>

          {/* Image Selection & Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-aura-secondary">
                Artwork Photography Asset
              </label>
              <button
                type="button"
                onClick={() => setUseCustomUrl(!useCustomUrl)}
                className="text-xs text-aura-accent hover:underline font-semibold"
              >
                {useCustomUrl ? 'Use curated photo preset' : 'Or paste custom image URL'}
              </button>
            </div>

            {useCustomUrl ? (
              <input
                type="url"
                name="customImage"
                value={formData.customImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or /assets/images/..."
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              />
            ) : (
              <select
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
              >
                {IMAGE_PRESETS.map((preset) => (
                  <option key={preset.path} value={preset.path}>
                    {preset.label} ({preset.path.split('/').pop()})
                  </option>
                ))}
              </select>
            )}

            {/* Thumbnail Preview */}
            <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-aura-base border border-black/5">
              <img
                src={activePreviewImage}
                alt="Preview"
                onError={(e) => {
                  e.target.src = '/assets/images/architecture-minimal.jpg';
                }}
                className="w-16 h-12 object-cover rounded-lg border border-black/10"
              />
              <div className="text-xs text-aura-secondary truncate">
                <span className="font-semibold text-aura-primary">Asset:</span> {activePreviewImage}
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
              Exposure / Print Specifications (Comma Separated)
            </label>
            <input
              type="text"
              name="specs"
              value={formData.specs}
              onChange={handleChange}
              placeholder="e.g. Medium Format Hasselblad, f/8.0, 1/500s, ISO 64"
              className="w-full px-4 py-2.5 rounded-xl bg-aura-base border border-black/10 text-aura-primary text-sm focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aura-secondary mb-1">
              Curatorial Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the architectural concept, directional light, or exhibition context..."
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-aura-base border border-black/10 text-aura-primary focus:outline-none focus:ring-2 focus:ring-aura-accent/50 focus:border-aura-accent transition-all resize-y"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-aura-secondary hover:text-aura-primary hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-aura-primary hover:bg-aura-accent transition-colors shadow-warm-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving to PostgreSQL...</span>
                </>
              ) : (
                <>
                  <span>Save Artwork to Portfolio</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
