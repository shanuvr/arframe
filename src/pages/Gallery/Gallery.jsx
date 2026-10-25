import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios.js';
import './Gallery.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const getImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';
  if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
  return `${IMAGE_BASE_URL}${img}`;
};

const DEFAULT_GALLERY_IMAGES = [
  {
    id: 1,
    title: 'Minimalist Monolith Villa',
    category: 'Architecture',
    src: getImageUrl('gallery/gallery_1_minimalist_villa.jpg'),
    aspect: 'tall',
  },
  {
    id: 2,
    title: 'Nordic Light Living Lounge',
    category: 'Interior',
    src: getImageUrl('gallery/gallery_2_nordic_lounge.jpg'),
    aspect: 'wide',
  },
  {
    id: 3,
    title: 'Glass Pavilion Horizon',
    category: 'Architecture',
    src: getImageUrl('gallery/gallery_3_glass_pavilion.jpg'),
    aspect: 'tall',
  },
  {
    id: 4,
    title: 'Artisan Walnut Dining Space',
    category: 'Interior',
    src: getImageUrl('gallery/gallery_4_walnut_dining.jpg'),
    aspect: 'square',
  },
  {
    id: 5,
    title: 'Brutalist Concrete Residence',
    category: 'Exterior',
    src: getImageUrl('gallery/gallery_5_concrete_residence.jpg'),
    aspect: 'wide',
  },
  {
    id: 6,
    title: 'Double-Height Timber Void',
    category: 'Interior',
    src: getImageUrl('gallery/gallery_6_timber_void.jpg'),
    aspect: 'tall',
  },
  {
    id: 7,
    title: 'Cantilever Coastal Retreat',
    category: 'Architecture',
    src: getImageUrl('gallery/gallery_7_coastal_retreat.jpg'),
    aspect: 'square',
  },
  {
    id: 8,
    title: 'Zen Courtyard & Infinity Deck',
    category: 'Exterior',
    src: getImageUrl('gallery/gallery_8_zen_courtyard.jpg'),
    aspect: 'wide',
  },
  {
    id: 9,
    title: 'Modern Geometric Facade',
    category: 'Architecture',
    src: getImageUrl('gallery/gallery_9_geometric_facade.jpg'),
    aspect: 'tall',
  },
  {
    id: 10,
    title: 'Sculptural Marble Kitchen Island',
    category: 'Interior',
    src: getImageUrl('gallery/gallery_10_marble_kitchen.jpg'),
    aspect: 'square',
  },
  {
    id: 11,
    title: 'Bespoke Twilight Terrace',
    category: 'Exterior',
    src: getImageUrl('gallery/gallery_11_twilight_terrace.jpg'),
    aspect: 'wide',
  },
  {
    id: 12,
    title: 'Contemporary Linear Suite',
    category: 'Interior',
    src: getImageUrl('gallery/gallery_12_linear_suite.jpg'),
    aspect: 'tall',
  },
];

const CATEGORIES = ['All', 'Architecture', 'Interior', 'Exterior'];

const Gallery = () => {
  const [images, setImages] = useState(DEFAULT_GALLERY_IMAGES);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [fitMode, setFitMode] = useState('contain'); // 'contain' | 'cover'
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch gallery items from real API
  useEffect(() => {
    let isMounted = true;
    const fetchGallery = async () => {
      try {
        const res = await api.get('/api/gallery');
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          const mapped = res.data.data.map((item) => ({
            ...item,
            src: getImageUrl(item.image),
          }));
          setImages(mapped);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  // Touch gesture coordinates
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const currentIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const navigateLightbox = useCallback(
    (direction) => {
      if (!selectedImage) return;
      const idx = filteredImages.findIndex((img) => img.id === selectedImage.id);
      if (idx === -1) return;
      const nextIndex = (idx + direction + filteredImages.length) % filteredImages.length;
      setSelectedImage(filteredImages[nextIndex]);
    },
    [selectedImage, filteredImages]
  );

  // Lock body scroll and pause Lenis while lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [selectedImage]);

  // Track native fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const closeLightbox = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setSelectedImage(null);
    setFitMode('contain');
    setShowControls(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateLightbox]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX - endX;
    const diffY = touchStartY - endY;

    // Horizontal swipe (left / right)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        navigateLightbox(1); // Swipe left -> next
      } else {
        navigateLightbox(-1); // Swipe right -> previous
      }
    }
    // Vertical swipe down to dismiss
    else if (diffY < -80 && Math.abs(diffX) < 60) {
      closeLightbox();
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const toggleFitMode = (e) => {
    e.stopPropagation();
    setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'));
  };

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

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className={`gallery-lightbox-fullscreen ${!showControls ? 'hide-controls' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Control Bar */}
          <div className="fs-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="fs-top-left">
              <span className="fs-counter">
                {currentIndex + 1} / {filteredImages.length}
              </span>
              <span className="fs-category-badge">{selectedImage.category}</span>
            </div>

            <div className="fs-top-right">
              {/* Fit / Fill toggle */}
              <button
                type="button"
                className="fs-btn"
                onClick={toggleFitMode}
                title={fitMode === 'contain' ? 'Fill screen' : 'Fit to screen'}
                aria-label="Toggle fit mode"
              >
                <i
                  className={
                    fitMode === 'contain'
                      ? 'fa-solid fa-up-right-and-down-left-from-center'
                      : 'fa-solid fa-down-left-and-up-right-to-center'
                  }
                ></i>
              </button>

              {/* Native Fullscreen Button */}
              <button
                type="button"
                className="fs-btn fs-btn-fullscreen"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                aria-label="Toggle fullscreen"
              >
                <i className={isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'}></i>
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="fs-btn fs-btn-close"
                onClick={closeLightbox}
                title="Close (Esc)"
                aria-label="Close image modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Previous Image Button */}
          <button
            type="button"
            className="fs-nav-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }}
            aria-label="Previous image"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Fullscreen Image Viewport */}
          <div
            className="fs-image-viewport"
            onClick={() => setShowControls((prev) => !prev)}
            onDoubleClick={toggleFitMode}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className={`fs-image ${fitMode === 'cover' ? 'fill' : ''}`}
            />
          </div>

          {/* Next Image Button */}
          <button
            type="button"
            className="fs-nav-btn next"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }}
            aria-label="Next image"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Bottom Floating Caption */}
          <div className="fs-caption-bar" onClick={(e) => e.stopPropagation()}>
            <h3 className="fs-caption-title">{selectedImage.title}</h3>
            <span className="fs-caption-hint">
              Swipe left/right to browse • Swipe down to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
