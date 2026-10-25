import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import './AdminBeforeAfter.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/')) {
    return url;
  }
  return `${IMAGE_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const AdminBeforeAfter = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Form State for Adding / Editing Transformation
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Renovation',
    location: '',
    year: '',
    beforeFile: null,
    afterFile: null,
    beforePreview: '',
    afterPreview: '',
  });

  const fetchTransformations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/before-after');
      if (response.data && response.data.data) {
        setItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load transformations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/admin', { replace: true });
      return;
    }
    fetchTransformations();
  }, [navigate]);

  const openAddModal = () => {
    setEditingItem(null);
    setErrorMessage('');
    setFormData({
      title: '',
      category: 'Home Renovation',
      location: '',
      year: new Date().getFullYear().toString(),
      beforeFile: null,
      afterFile: null,
      beforePreview: '',
      afterPreview: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setErrorMessage('');
    setFormData({
      title: item.title || '',
      category: item.category || 'Home Renovation',
      location: item.location || '',
      year: item.year || new Date().getFullYear().toString(),
      beforeFile: null,
      afterFile: null,
      beforePreview: getImageUrl(item.before_image || item.before),
      afterPreview: getImageUrl(item.after_image || item.after),
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [`${field}File`]: file,
        [`${field}Preview`]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveTransformation = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please provide a title for this transformation.');
      return;
    }

    if (!editingItem && (!formData.beforeFile || !formData.afterFile)) {
      setErrorMessage('Please upload both Before and After photos.');
      return;
    }

    if (editingItem && (!formData.beforePreview || !formData.afterPreview)) {
      setErrorMessage('Both Before and After photos are required.');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('location', formData.location.trim());
      data.append('year', formData.year || new Date().getFullYear().toString());

      if (formData.beforeFile) {
        data.append('before_image', formData.beforeFile);
      }
      if (formData.afterFile) {
        data.append('after_image', formData.afterFile);
      }

      if (editingItem) {
        await api.put(`/api/before-after/${editingItem.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/before-after', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchTransformations();
    } catch (err) {
      console.error('Save transformation failed:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to save transformation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transformation?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/api/before-after/${id}`);
      await fetchTransformations();
    } catch (err) {
      console.error('Failed to delete transformation:', err);
      alert(err.response?.data?.error || 'Failed to delete transformation.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Before & After Transformations">
      <div className="admin-ba-page">
        {/* Header */}
        <div className="ba-header-box">
          <div className="header-meta">
            <h3>Real Project Transformations</h3>
            <p>Manage side-by-side comparison showcases displayed in the "Proven Results" section.</p>
          </div>
          <button
            type="button"
            className="btn-add-transformation"
            onClick={openAddModal}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Transformation</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="ba-stats-row">
          <div className="ba-stat-item">
            <span className="label">Active Transformations</span>
            <span className="val">{items.length}</span>
          </div>
          <div className="ba-stat-item">
            <span className="label">Home Renovations</span>
            <span className="val">{items.filter((i) => i.category?.includes('Renovation')).length}</span>
          </div>
          <div className="ba-stat-item">
            <span className="label">Interiors & Exteriors</span>
            <span className="val">{items.filter((i) => !i.category?.includes('Renovation')).length}</span>
          </div>
        </div>

        {/* Items List */}
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#b58500', marginBottom: '12px', display: 'block' }}></i>
            <span>Loading transformations from database...</span>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <i className="fa-solid fa-images" style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}></i>
            <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>No Transformations Found</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>Create your first before & after transformation to display on the portfolio.</p>
            <button type="button" className="btn-add-transformation" onClick={openAddModal}>
              <i className="fa-solid fa-plus"></i> Add Transformation
            </button>
          </div>
        ) : (
          <div className="ba-cards-list">
            {items.map((item) => (
              <div key={item.id} className="ba-admin-card">
                <div className="ba-card-top-bar">
                  <div className="card-heading-group">
                    <span className="ba-category-badge">{item.category}</span>
                    <h4 className="card-item-title">{item.title}</h4>
                    <span className="card-location">
                      <i className="fa-solid fa-location-dot"></i> {item.location || 'India'} {item.year ? `(${item.year})` : ''}
                    </span>
                  </div>
                  <div className="card-header-actions">
                    <button
                      type="button"
                      className="btn-card-action edit"
                      title="Edit transformation"
                      onClick={() => openEditModal(item)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-card-action delete"
                      title="Delete transformation"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className={deletingId === item.id ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-trash-can"}></i>
                    </button>
                  </div>
                </div>

                {/* Side by side comparison preview */}
                <div className="ba-comparison-dual-view">
                  {/* Before Container */}
                  <div className="dual-view-side before-side">
                    <div className="image-frame">
                      <img src={getImageUrl(item.before_image || item.before)} alt={`${item.title} Before`} />
                      <span className="status-pill before-pill">BEFORE</span>
                    </div>
                  </div>

                  {/* Arrow Divider */}
                  <div className="dual-view-arrow">
                    <div className="arrow-circle">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>

                  {/* After Container */}
                  <div className="dual-view-side after-side">
                    <div className="image-frame">
                      <img src={getImageUrl(item.after_image || item.after)} alt={`${item.title} After`} />
                      <span className="status-pill after-pill">AFTER</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Transformation Modal */}
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => !saving && setIsModalOpen(false)}>
            <div className="admin-modal-box ba-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h4>{editingItem ? 'Edit Transformation' : 'Add New Transformation'}</h4>
                  <p>
                    {editingItem
                      ? 'Update the project details or replace Before & After imagery.'
                      : 'Provide Before & After images and details to show on the portfolio.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {errorMessage && (
                <div style={{
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  margin: '16px 24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveTransformation} className="modal-form">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="title">Project / Transformation Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="e.g. Modern Villa Renovation"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                      required
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
                      <option value="Home Renovation">Home Renovation</option>
                      <option value="Interior Transformation">Interior Transformation</option>
                      <option value="Exterior Architecture">Exterior Architecture</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g., Bangalore, Karnataka"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ width: '130px' }}>
                    <label htmlFor="year">Year</label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="2025"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Dual Upload Blocks */}
                <div className="modal-dual-uploads">
                  {/* Before Side */}
                  <div className="upload-box-column">
                    <label className="upload-label">
                      <span className="tag-dot before"></span> Before Image
                    </label>
                    <div className="upload-slot">
                      {formData.beforePreview ? (
                        <div className="slot-preview">
                          <img src={formData.beforePreview} alt="Before Preview" />
                          <button
                            type="button"
                            className="btn-slot-remove"
                            onClick={() => setFormData((prev) => ({ ...prev, beforePreview: '', beforeFile: null }))}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ) : (
                        <label className="slot-uploader">
                          <i className="fa-solid fa-camera"></i>
                          <span>Upload Before Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden-file-input"
                            onChange={(e) => handleFileUpload(e, 'before')}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* After Side */}
                  <div className="upload-box-column">
                    <label className="upload-label">
                      <span className="tag-dot after"></span> After Image
                    </label>
                    <div className="upload-slot">
                      {formData.afterPreview ? (
                        <div className="slot-preview">
                          <img src={formData.afterPreview} alt="After Preview" />
                          <button
                            type="button"
                            className="btn-slot-remove"
                            onClick={() => setFormData((prev) => ({ ...prev, afterPreview: '', afterFile: null }))}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ) : (
                        <label className="slot-uploader">
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                          <span>Upload After Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden-file-input"
                            onChange={(e) => handleFileUpload(e, 'after')}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    disabled={saving}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm-upload" disabled={saving}>
                    <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-check"}></i>{' '}
                    {saving ? 'Saving...' : (editingItem ? 'Update Transformation' : 'Save Transformation')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBeforeAfter;
