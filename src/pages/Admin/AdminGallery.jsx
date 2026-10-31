import { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import './AdminGallery.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const getImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  return `${IMAGE_BASE_URL}${img}`;
};

// Automatically detect layout aspect ratio from image natural dimensions
const detectAspectRatio = (width, height) => {
  if (!width || !height) return 'square';
  const ratio = width / height;
  if (ratio > 1.25) return 'wide';
  if (ratio < 0.85) return 'tall';
  return 'square';
};

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form State (aspect ratio detected 100% automatically)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Gallery',
    aspect: 'tall',
    display_order: 0,
    filePreview: '',
  });

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/gallery');
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Filtered Items (by search query only)
  const filteredItems = items.filter((item) => {
    return !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      category: 'Gallery',
      aspect: 'tall',
      display_order: items.length + 1,
      filePreview: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
    setFormData({
      title: item.title || '',
      category: item.category || 'Gallery',
      aspect: item.aspect || 'tall',
      display_order: item.display_order || 0,
      filePreview: getImageUrl(item.image),
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Automatically detect aspect ratio upon file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        // Probe image dimensions to automatically determine aspect ratio
        const img = new Image();
        img.onload = () => {
          const autoAspect = detectAspectRatio(img.naturalWidth, img.naturalHeight);
          setFormData((prev) => ({
            ...prev,
            filePreview: result,
            aspect: autoAspect,
          }));
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a photo title.');
      return;
    }

    if (!editingItem && !selectedFile) {
      alert('Please select an image file to upload.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category || 'Gallery');
      data.append('aspect', formData.aspect || 'tall');
      data.append('display_order', formData.display_order);

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      if (editingItem) {
        await api.put(`/api/gallery/${editingItem.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/gallery', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await fetchGallery();
      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedFile(null);
    } catch (err) {
      console.error('Failed to save gallery item:', err);
      alert(err.response?.data?.error || 'Failed to save gallery item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery photo?')) {
      return;
    }

    try {
      await api.delete(`/api/gallery/${id}`);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete gallery item:', err);
      alert(err.response?.data?.error || 'Failed to delete photo. Please try again.');
    }
  };

  return (
    <AdminLayout title="Gallery Showcase">
      <div className="admin-gallery-page">
        {/* Top Control Header */}
        <div className="gallery-mgmt-header">
          <div className="header-meta">
            <h3>Gallery Portfolio Management</h3>
            <p>Upload architectural photos directly. Aspect ratios and layouts are detected automatically.</p>
          </div>
          <button
            type="button"
            className="btn-upload-trigger"
            onClick={handleOpenAddModal}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Gallery Photo</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="gallery-stats-cards">
          <div className="stat-card">
            <span className="stat-label">Total Gallery Photos</span>
            <span className="stat-value">{items.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Aspect Ratios</span>
            <span className="stat-value" style={{ fontSize: '1.2rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> 100% Auto-Detected
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Showcase Status</span>
            <span className="stat-value" style={{ fontSize: '1.2rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-circle-check"></i> Live on Website
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="gallery-controls-bar" style={{ justifyContent: 'flex-end' }}>
          <div className="gallery-search-box" style={{ maxWidth: '380px', width: '100%' }}>
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search gallery photos by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gallery-search-input"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="gallery-loading-state">
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p>Loading gallery photos...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="gallery-empty-state">
            <i className="fa-regular fa-images empty-icon"></i>
            <h4>No Photos Found</h4>
            <p>
              {searchQuery
                ? `No photos matching "${searchQuery}".`
                : 'No photos uploaded to the gallery yet.'}
            </p>
            <button
              type="button"
              className="btn-upload-trigger"
              onClick={handleOpenAddModal}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Add First Photo</span>
            </button>
          </div>
        ) : (
          <div className="admin-gallery-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="admin-gallery-card">
                <div className="card-thumb-wrapper">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="card-thumb-img"
                    loading="lazy"
                  />
                  <div className="thumb-hover-actions">
                    <button
                      type="button"
                      className="action-icon-btn preview"
                      title="View Fullscreen"
                      onClick={() => setPreviewItem(item)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn edit"
                      title="Edit Item"
                      onClick={() => handleOpenEditModal(item)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn delete"
                      title="Remove Photo"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
                <div className="card-info">
                  <h4 className="card-title" title={item.title}>{item.title}</h4>
                  <div className="card-meta-line">
                    <span className="card-order-text">Order: {item.display_order ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Modal (Completely Automated Aspect Ratio) */}
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => !submitting && setIsModalOpen(false)}>
            <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h4>{editingItem ? 'Edit Gallery Photo' : 'Add Gallery Photo'}</h4>
                  <p>Upload architectural photos directly. Layout proportions are detected automatically.</p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {/* Drag & Drop Dropzone */}
                <div className="dropzone-area">
                  {formData.filePreview ? (
                    <div className="dropzone-preview">
                      <img src={formData.filePreview} alt="Preview" />
                      <button
                        type="button"
                        className="btn-change-file"
                        disabled={submitting}
                        onClick={() => {
                          setSelectedFile(null);
                          setFormData((prev) => ({ ...prev, filePreview: '' }));
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i> {editingItem ? 'Change Photo' : 'Remove Photo'}
                      </button>
                    </div>
                  ) : (
                    <label className="dropzone-label">
                      <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
                      <span className="dropzone-text">Click or drag image here to upload</span>
                      <span className="dropzone-hint">Layout proportion is detected automatically</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="dropzone-hidden-input"
                        onChange={handleFileChange}
                        disabled={submitting}
                      />
                    </label>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="title">Photo Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Cantilever Coastal Retreat"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="display_order">Display Order (optional)</label>
                  <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={submitting}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    disabled={submitting}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm-upload" disabled={submitting}>
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check"></i> {editingItem ? 'Save Changes' : 'Upload to Gallery'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fullscreen Preview Lightbox */}
        {previewItem && (
          <div className="admin-modal-overlay" onClick={() => setPreviewItem(null)}>
            <div className="preview-modal-box" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn preview-close"
                onClick={() => setPreviewItem(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <img
                src={getImageUrl(previewItem.image)}
                alt={previewItem.title}
                className="preview-full-img"
              />
              <div className="preview-footer">
                <div>
                  <h4 className="preview-title">{previewItem.title}</h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
