import { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminGallery.css';

const INITIAL_GALLERY_IMAGES = [
  {
    id: 1,
    title: 'Minimalist Monolith Villa',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    dateAdded: '2026-03-15',
    resolution: '1920 × 1280',
  },
  {
    id: 2,
    title: 'Nordic Light Living Lounge',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    dateAdded: '2026-03-12',
    resolution: '2048 × 1365',
  },
  {
    id: 3,
    title: 'Glass Pavilion Horizon',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    dateAdded: '2026-03-10',
    resolution: '1920 × 1080',
  },
  {
    id: 4,
    title: 'Artisan Walnut Dining Space',
    category: 'Interior',
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    dateAdded: '2026-03-08',
    resolution: '1600 × 1200',
  },
  {
    id: 5,
    title: 'Brutalist Concrete Residence',
    category: 'Exterior',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    dateAdded: '2026-03-04',
    resolution: '1920 × 1280',
  },
  {
    id: 6,
    title: 'Cantilever Coastal Retreat',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    dateAdded: '2026-02-28',
    resolution: '2400 × 1600',
  },
];

const CATEGORIES = ['All', 'Architecture', 'Interior', 'Exterior'];

const AdminGallery = () => {
  const [images, setImages] = useState(INITIAL_GALLERY_IMAGES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // New Image Form State (Static UI)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Architecture',
    imageUrl: '',
    filePreview: '',
  });

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter((img) => img.category === activeFilter);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          filePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    const finalSrc = formData.filePreview || formData.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const newImage = {
      id: Date.now(),
      title: formData.title || 'Untitled Architectural Photo',
      category: formData.category,
      src: finalSrc,
      dateAdded: new Date().toISOString().split('T')[0],
      resolution: 'High Resolution',
    };

    setImages([newImage, ...images]);
    setIsUploadModalOpen(false);
    setFormData({
      title: '',
      category: 'Architecture',
      imageUrl: '',
      filePreview: '',
    });
  };

  const handleDeleteImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="admin-gallery-page">
        {/* Top Control Header */}
        <div className="gallery-mgmt-header">
          <div className="header-meta">
            <h3>Curated Image Catalog</h3>
            <p>Manage and upload high-resolution photography displayed on the public Gallery page.</p>
          </div>
          <button
            type="button"
            className="btn-upload-trigger"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <span>Upload New Image</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="gallery-stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Gallery Photos</span>
            <span className="stat-value">{images.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Architecture</span>
            <span className="stat-value">{images.filter((i) => i.category === 'Architecture').length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Interiors</span>
            <span className="stat-value">{images.filter((i) => i.category === 'Interior').length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Exteriors</span>
            <span className="stat-value">{images.filter((i) => i.category === 'Exterior').length}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="admin-filter-bar">
          <div className="filter-pill-group">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`admin-filter-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="filter-count">Showing {filteredImages.length} images</span>
        </div>

        {/* Image Grid */}
        <div className="admin-gallery-grid">
          {filteredImages.map((image) => (
            <div key={image.id} className="admin-gallery-card">
              <div className="card-thumb-wrapper">
                <img src={image.src} alt={image.title} className="card-thumb-img" />
                <span className="thumb-badge">{image.category}</span>
                <div className="thumb-hover-actions">
                  <button
                    type="button"
                    className="action-icon-btn preview"
                    title="View Fullscreen"
                    onClick={() => setPreviewImage(image)}
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn delete"
                    title="Remove from Gallery"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div className="card-info">
                <h4 className="card-title" title={image.title}>{image.title}</h4>
                <div className="card-sub-info">
                  <span><i className="fa-regular fa-calendar"></i> {image.dateAdded}</span>
                  <span><i className="fa-regular fa-image"></i> {image.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
            <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h4>Upload Image to Gallery</h4>
                  <p>Choose an image file or specify an image URL to showcase in the portfolio.</p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleAddImage} className="modal-form">
                {/* Drag & Drop Dropzone */}
                <div className="dropzone-area">
                  {formData.filePreview ? (
                    <div className="dropzone-preview">
                      <img src={formData.filePreview} alt="Preview" />
                      <button
                        type="button"
                        className="btn-change-file"
                        onClick={() => setFormData((prev) => ({ ...prev, filePreview: '' }))}
                      >
                        <i className="fa-solid fa-xmark"></i> Remove File
                      </button>
                    </div>
                  ) : (
                    <label className="dropzone-label">
                      <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
                      <span className="dropzone-text">Click or drag image here to upload</span>
                      <span className="dropzone-hint">Supports high-res PNG, JPG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="dropzone-hidden-input"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                <div className="form-divider">
                  <span>OR USE IMAGE URL</span>
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL (Unsplash or CDN link)</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="title">Photo Title / Caption</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="e.g., Waterfront Infinity Pool"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="Architecture">Architecture</option>
                      <option value="Interior">Interior</option>
                      <option value="Exterior">Exterior</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsUploadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm-upload">
                    <i className="fa-solid fa-check"></i> Add to Gallery
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fullscreen Preview Lightbox */}
        {previewImage && (
          <div className="admin-modal-overlay" onClick={() => setPreviewImage(null)}>
            <div className="preview-modal-box" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn preview-close"
                onClick={() => setPreviewImage(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <img src={previewImage.src} alt={previewImage.title} className="preview-full-img" />
              <div className="preview-footer">
                <span className="preview-tag">{previewImage.category}</span>
                <span className="preview-title">{previewImage.title}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
