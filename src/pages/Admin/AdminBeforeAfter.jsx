import { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminBeforeAfter.css';

const INITIAL_TRANSFORMATIONS = [
  {
    id: 1,
    title: 'Heritage Villa Revival',
    category: 'Home Renovation',
    before: '/before-after/beforea1.jpg',
    after: '/before-after/beoforea2.jpg',
    location: 'Bangalore, Karnataka',
    year: '2025',
  },
  {
    id: 2,
    title: 'Modern Minimalist Facade',
    category: 'Exterior Architecture',
    before: '/before-after/beforeb1.jpg',
    after: '/before-after/beforeb2.jpg',
    location: 'Kochi, Kerala',
    year: '2024',
  },
  {
    id: 3,
    title: 'Urban Penthouse Living Space',
    category: 'Interior Transformation',
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    location: 'Chennai, Tamil Nadu',
    year: '2025',
  },
];

const AdminBeforeAfter = () => {
  const [items, setItems] = useState(INITIAL_TRANSFORMATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State for Adding / Editing Transformation (Static Design)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Renovation',
    location: '',
    beforeUrl: '',
    afterUrl: '',
    beforePreview: '',
    afterPreview: '',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Home Renovation',
      location: '',
      beforeUrl: '',
      afterUrl: '',
      beforePreview: '',
      afterPreview: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      location: item.location || '',
      beforeUrl: item.before?.startsWith('http') ? item.before : '',
      afterUrl: item.after?.startsWith('http') ? item.after : '',
      beforePreview: item.before || '',
      afterPreview: item.after || '',
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [`${field}Preview`]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTransformation = (e) => {
    e.preventDefault();

    if (editingItem) {
      // Update existing item
      const updated = items.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            title: formData.title || it.title,
            category: formData.category,
            location: formData.location || it.location,
            before: formData.beforePreview || formData.beforeUrl || it.before,
            after: formData.afterPreview || formData.afterUrl || it.after,
          };
        }
        return it;
      });
      setItems(updated);
    } else {
      // Create new item
      const newEntry = {
        id: Date.now(),
        title: formData.title || 'Bespoke Transformation',
        category: formData.category,
        location: formData.location || 'India',
        before: formData.beforePreview || formData.beforeUrl || '/before-after/beforea1.jpg',
        after: formData.afterPreview || formData.afterUrl || '/before-after/beoforea2.jpg',
        year: new Date().getFullYear().toString(),
      };
      setItems([newEntry, ...items]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Home Renovation',
      location: '',
      beforeUrl: '',
      afterUrl: '',
      beforePreview: '',
      afterPreview: '',
    });
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
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
            <span className="val">{items.filter((i) => i.category.includes('Renovation')).length}</span>
          </div>
          <div className="ba-stat-item">
            <span className="label">Interiors & Exteriors</span>
            <span className="val">{items.filter((i) => !i.category.includes('Renovation')).length}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="ba-cards-list">
          {items.map((item) => (
            <div key={item.id} className="ba-admin-card">
              <div className="ba-card-top-bar">
                <div className="card-heading-group">
                  <span className="ba-category-badge">{item.category}</span>
                  <h4 className="card-item-title">{item.title}</h4>
                  <span className="card-location"><i className="fa-solid fa-location-dot"></i> {item.location} ({item.year})</span>
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
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              {/* Side by side comparison preview */}
              <div className="ba-comparison-dual-view">
                {/* Before Container */}
                <div className="dual-view-side before-side">
                  <div className="image-frame">
                    <img src={item.before} alt={`${item.title} Before`} />
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
                    <img src={item.after} alt={`${item.title} After`} />
                    <span className="status-pill after-pill">AFTER</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Transformation Modal */}
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
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
                  onClick={() => setIsModalOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

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

                <div className="form-group">
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
                            onClick={() => setFormData((prev) => ({ ...prev, beforePreview: '' }))}
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
                    <input
                      type="url"
                      name="beforeUrl"
                      placeholder="Or paste Before Image URL"
                      value={formData.beforeUrl}
                      onChange={handleInputChange}
                      className="form-control url-input"
                    />
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
                            onClick={() => setFormData((prev) => ({ ...prev, afterPreview: '' }))}
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
                    <input
                      type="url"
                      name="afterUrl"
                      placeholder="Or paste After Image URL"
                      value={formData.afterUrl}
                      onChange={handleInputChange}
                      className="form-control url-input"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm-upload">
                    <i className="fa-solid fa-check"></i> {editingItem ? 'Update Transformation' : 'Save Transformation'}
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
