import { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import './AdminProposedProjects.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const getImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  return `${IMAGE_BASE_URL}${img}`;
};

const AdminProposedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form State - only Title and Image File
  const [formData, setFormData] = useState({
    title: '',
    filePreview: '',
  });

  const fetchProposedProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/proposed-projects');
      if (res.data?.data) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch proposed projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposedProjects();
  }, [fetchProposedProjects]);

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a project title.');
      return;
    }

    if (!selectedFile) {
      alert('Please select an image file to upload.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('image', selectedFile);

      await api.post('/api/proposed-projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchProposedProjects();
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setFormData({
        title: '',
        filePreview: '',
      });
    } catch (err) {
      console.error('Failed to create proposed project:', err);
      alert(err.response?.data?.error || 'Failed to save proposed project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.delete(`/api/proposed-projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete proposed project:', err);
      alert(err.response?.data?.error || 'Failed to delete project. Please try again.');
    }
  };

  return (
    <AdminLayout title="Proposed & Ongoing Projects">
      <div className="admin-gallery-page">
        {/* Top Control Header */}
        <div className="gallery-mgmt-header">
          <div className="header-meta">
            <h3>Proposed & Ongoing Projects</h3>
            <p>Manage project photos stored in Cloudflare R2 and displayed on the Home Page slider.</p>
          </div>
          <button
            type="button"
            className="btn-upload-trigger"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <span>Add Project Photo</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="admin-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', maxWidth: '360px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  background: '#ffffff'
                }}
              />
            </div>
          </div>
          <span className="filter-count">Showing {filteredProjects.length} of {projects.length} project photos</span>
        </div>

        {/* Image Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Loading projects from database...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            color: '#64748b'
          }}>
            <i className="fa-solid fa-folder-open fa-3x" style={{ color: '#cbd5e1', marginBottom: '16px' }}></i>
            <h4 style={{ color: '#1e293b', marginBottom: '6px' }}>No Projects Found</h4>
            <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
              {searchQuery
                ? `No project matching "${searchQuery}".`
                : 'No proposed or ongoing projects added yet.'}
            </p>
            <button
              type="button"
              className="btn-upload-trigger"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Add Project Photo</span>
            </button>
          </div>
        ) : (
          <div className="admin-gallery-grid">
            {filteredProjects.map((image) => (
              <div key={image.id} className="admin-gallery-card">
                <div className="card-thumb-wrapper">
                  <img
                    src={getImageUrl(image.image)}
                    alt={image.title}
                    className="card-thumb-img"
                    loading="lazy"
                  />
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
                      title="Remove Project"
                      onClick={() => handleDeleteProject(image.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
                <div className="card-info">
                  <h4 className="card-title" title={image.title}>{image.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal (Only Image and Title) */}
        {isUploadModalOpen && (
          <div className="admin-modal-overlay" onClick={() => !submitting && setIsUploadModalOpen(false)}>
            <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h4>Add Proposed / Ongoing Project</h4>
                  <p>Upload a project photo or sketch to store in Cloudflare R2.</p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  disabled={submitting}
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleAddProject} className="modal-form">
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
                        <i className="fa-solid fa-xmark"></i> Remove File
                      </button>
                    </div>
                  ) : (
                    <label className="dropzone-label">
                      <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
                      <span className="dropzone-text">Click or drag image here to upload</span>
                      <span className="dropzone-hint">Stored in Cloudflare R2 (proposed/ folder)</span>
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
                  <label htmlFor="title">Project Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Waterfront Residence - Concept"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    disabled={submitting}
                    onClick={() => setIsUploadModalOpen(false)}
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
                        <i className="fa-solid fa-check"></i> Save Project Photo
                      </>
                    )}
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
              <img
                src={getImageUrl(previewImage.image)}
                alt={previewImage.title}
                className="preview-full-img"
              />
              <div className="preview-footer">
                <span className="preview-title">{previewImage.title}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProposedProjects;
