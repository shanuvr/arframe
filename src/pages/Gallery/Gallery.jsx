import { useState, useEffect, useCallback } from 'react';
import './Gallery.css';

const GALLERY_IMAGES = [
  {
    id: 1,
    title: 'Minimalist Monolith Villa',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    aspect: 'tall',
  },
  {
    id: 2,
    title: 'Nordic Light Living Lounge',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    aspect: 'wide',
  },
  {
    id: 3,
    title: 'Glass Pavilion Horizon',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    aspect: 'tall',
  },
  {
    id: 4,
    title: 'Artisan Walnut Dining Space',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    aspect: 'square',
  },
  {
    id: 5,
    title: 'Brutalist Concrete Residence',
    category: 'Exterior',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    aspect: 'wide',
  },
  {
    id: 6,
    title: 'Double-Height Timber Void',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
    aspect: 'tall',
  },
  {
    id: 7,
    title: 'Cantilever Coastal Retreat',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    aspect: 'square',
  },
  {
    id: 8,
    title: 'Zen Courtyard & Infinity Deck',
    category: 'Exterior',
    src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    aspect: 'wide',
  },
  {
    id: 9,
    title: 'Modern Geometric Facade',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    aspect: 'tall',
  },
  {
    id: 10,
    title: 'Sculptural Marble Kitchen Island',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=85',
    aspect: 'square',
  },
  {
    id: 11,
    title: 'Bespoke Twilight Terrace',
    category: 'Exterior',
    src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
    aspect: 'wide',
  },
  {
    id: 12,
    title: 'Contemporary Linear Suite',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    aspect: 'tall',
  },
];

const CATEGORIES = ['All', 'Architecture', 'Interior', 'Exterior'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const navigateLightbox = useCallback(
    (direction) => {
      if (!selectedImage) return;
      const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + filteredImages.length) % filteredImages.length;
      setSelectedImage(filteredImages[nextIndex]);
    },
    [selectedImage, filteredImages]
  );

  // Close lightbox on Escape key & arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight' && selectedImage) {
        navigateLightbox(1);
      }
      if (e.key === 'ArrowLeft' && selectedImage) {
        navigateLightbox(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateLightbox]);

  return (
    <div className="page-container gallery-page">
      {/* Standard Page Hero with Yellow Accent */}
      <section
        className="page-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85')",
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <span className="section-subtitle">PORTFOLIO SHOWCASE</span>
            <h1>
              Our <span>Gallery</span>
            </h1>
            <p>A curated visual collection of our finest architectural spaces and designs</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-main-section section-padding">
        <div className="gallery-container">
          {/* Category Filter Pills */}
          <div className="gallery-filter-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`gallery-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="gallery-grid">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`gallery-card ${image.aspect || ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="gallery-card-img"
                  loading="lazy"
                />
                <div className="gallery-card-overlay">
                  <div className="gallery-card-meta">
                    <span className="gallery-card-category">{image.category}</span>
                    <h3 className="gallery-card-title">{image.title}</h3>
                  </div>
                  <div className="gallery-card-zoom-icon">
                    <i className="fa-solid fa-expand"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="gallery-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <button
              className="lightbox-nav-btn prev"
              onClick={() => navigateLightbox(-1)}
              aria-label="Previous image"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="lightbox-image-wrapper">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <span className="lightbox-category">{selectedImage.category}</span>
                <h4 className="lightbox-title">{selectedImage.title}</h4>
              </div>
            </div>

            <button
              className="lightbox-nav-btn next"
              onClick={() => navigateLightbox(1)}
              aria-label="Next image"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
