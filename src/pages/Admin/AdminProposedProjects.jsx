import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import { buildImageUrl } from '../../api/pageSettings.js';
import { getProposedProjects, MAX_PROPOSED_PROJECTS } from '../../data/proposedProjectsData.js';
import './AdminProposedProjects.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80';

const AdminProposedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const initialForm = {
    title: '',
    subtitle: '',
    image: '',
    coverFile: null,
    existingGallery: [],
    newGalleryFiles: [],
  };
  const [formData, setFormData] = useState(initialForm);

  // Load from backend API with fallback
  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/proposed-projects');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setProjects(res.data.data);
      } else {
        setProjects(getProposedProjects());
      }
    } catch (err) {
      console.warn('API error in admin proposed projects, using fallback:', err);
      setProjects(getProposedProjects());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const isFull = projects.length >= MAX_PROPOSED_PROJECTS;

  // Open modal for Adding
  const handleOpenAdd = () => {
    if (isFull) {
      showToast(`Showcase is full (5/5 projects). Please delete an existing project before adding a new one.`);
      return;
    }
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (project) => {
    setIsEditing(true);
    setEditingId(project.id);
    const existingList = Array.isArray(project.gallery) && project.gallery.length > 0
      ? [...project.gallery]
      : (project.image ? [project.image] : []);

    setFormData({
      title: project.title || '',
      subtitle: project.subtitle || '',
      image: project.image || '',
      coverFile: null,
      existingGallery: existingList,
      newGalleryFiles: [],
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle cover image file upload
  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverFile: file,
        image: URL.createObjectURL(file),
      }));
    }
  };

  // Gallery multiple file upload
  const handleGalleryFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      newGalleryFiles: [...prev.newGalleryFiles, ...newItems],
    }));
    e.target.value = '';
  };

  // Combined gallery photos for modal preview
  const allGalleryPhotos = useMemo(() => {
    const existing = (formData.existingGallery || []).map((url, index) => ({
      type: 'existing',
      url,
      index,
    }));
    const newlyAdded = (formData.newGalleryFiles || []).map((item, index) => ({
      type: 'new',
      url: item.preview,
      index,
    }));
    return [...existing, ...newlyAdded];
  }, [formData.existingGallery, formData.newGalleryFiles]);

  const handleRemoveGalleryPhoto = (type, index) => {
    if (type === 'existing') {
      setFormData((prev) => ({
        ...prev,
        existingGallery: prev.existingGallery.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        newGalleryFiles: prev.newGalleryFiles.filter((_, i) => i !== index),
      }));
    }
  };

  // Submit Add or Edit to backend D1/R2 API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a project title.');
      return;
    }

    if (!isEditing && isFull) {
      alert(`Maximum ${MAX_PROPOSED_PROJECTS} showcase projects allowed. Please delete an existing project before adding a new one.`);
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('subtitle', formData.subtitle.trim());

      if (formData.coverFile) {
        payload.append('image', formData.coverFile);
      } else if (formData.image) {
        payload.append('imageUrl', formData.image);
      }

      (formData.existingGallery || []).forEach((item) => {
        payload.append('keep_gallery', item);
      });

      (formData.newGalleryFiles || []).forEach((item) => {
        payload.append('gallery_files', item.file);
      });

      if (isEditing && editingId) {
        await api.put(`/api/proposed-projects/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(`Updated "${formData.title}" successfully in D1!`);
      } else {
        await api.post('/api/proposed-projects', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast(`Added "${formData.title}" to D1 showcase!`);
      }

      await loadProjects();
      window.dispatchEvent(new Event('proposed_projects_updated'));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving proposed project:', err);
      alert('Failed to save proposed project to backend API. Please check server logs.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete project from backend D1/R2 API
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will free up a slot in the 5-project showcase.`)) {
      return;
    }

    try {
      await api.delete(`/api/proposed-projects/${id}`);
      await loadProjects();
      window.dispatchEvent(new Event('proposed_projects_updated'));
      showToast(`Removed "${title}". You can now add a new project slot.`);
    } catch (err) {
      console.error('Error deleting proposed project:', err);
      alert('Failed to delete proposed project from backend.');
    }
  };

  return (
    <AdminLayout title="Proposed & Ongoing Projects">
      <div className="admin-gallery-page">
        {/* Toast alert */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#FFC107',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid #FFC107',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <i className="fa-solid fa-circle-info"></i>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Control Header */}
        <div className="gallery-mgmt-header">
          <div className="header-meta">
            <h3>Proposed &amp; Ongoing Projects Showcase</h3>
            <p>Manage the exactly 5 showcase projects displayed in a row on the Home page and their photo galleries.</p>
          </div>
          <button
            type="button"
            className={`btn-upload-trigger ${isFull ? 'btn-at-capacity' : ''}`}
            onClick={isFull ? () => showToast(`Maximum 5 projects reached. Please delete an existing project before adding a new one.`) : handleOpenAdd}
            title={isFull ? 'Maximum 5 projects reached. Delete an existing project to add another.' : 'Add Showcase Project'}
          >
            <i className={`fa-solid ${isFull ? 'fa-lock' : 'fa-plus'}`}></i>
            <span>{isFull ? 'Showcase Full (5/5 Max)' : 'Add Showcase Project'}</span>
          </button>
        </div>

        {/* 5-Project Limit Banner Notice */}
        {isFull ? (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderLeft: '4px solid #b58500',
            borderRadius: '10px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '18px', color: '#b58500' }}></i>
              <span style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                <strong>5-Project Showcase Capacity Reached:</strong> Exactly 5 projects are displayed across the Home screen row. To add a different project, please <strong>delete</strong> one of the existing projects below or <strong>edit</strong> them.
              </span>
            </div>
            <span style={{
              background: '#b58500',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              5 / 5 Slots Active
            </span>
          </div>
        ) : (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderLeft: '4px solid #10b981',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#065f46',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
              <span>{MAX_PROPOSED_PROJECTS - projects.length} showcase slot(s) available. You can add up to 5 projects.</span>
            </div>
            <span style={{ fontWeight: 700 }}>{projects.length} / 5 Slots</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="gallery-stats-row">
          <div className="stat-card">
            <span className="stat-label">Showcase Projects</span>
            <span className="stat-value">{projects.length} / {MAX_PROPOSED_PROJECTS}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Gallery Photos</span>
            <span className="stat-value">
              {projects.reduce((acc, curr) => acc + (curr.gallery?.length || 1), 0)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Showcase Status</span>
            <span className="stat-value" style={{ color: isFull ? '#0284c7' : '#10b981', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-circle-check"></i> {isFull ? '5 / 5 Live on Home' : `${projects.length} / 5 Active`}
            </span>
          </div>
        </div>

        {/* Project Card Grid (Clean 5 projects, no search or filters) */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1',
            color: '#64748b'
          }}>
            <i className="fa-solid fa-folder-open fa-3x" style={{ color: '#cbd5e1', marginBottom: '16px' }}></i>
            <h4 style={{ color: '#1e293b', marginBottom: '6px' }}>No Projects Available</h4>
            <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
              Get started by adding your first showcase project.
            </p>
            <button
              type="button"
              className="btn-upload-trigger"
              onClick={handleOpenAdd}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Add New Project</span>
            </button>
          </div>
        ) : (
          <div className="admin-gallery-grid">
            {projects.map((p) => {
              const photoCount = p.gallery?.length || 1;
              return (
                <div key={p.id} className="admin-gallery-card">
                  <div className="card-thumb-wrapper">
                    <img
                      src={buildImageUrl(p.image || p.gallery?.[0]) || FALLBACK_IMAGE}
                      alt={p.title}
                      className="card-thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className="fa-solid fa-images"></i> {photoCount} Photos
                    </span>

                    <div className="thumb-hover-actions">
                      <Link
                        to={`/proposed-projects/${p.id}`}
                        target="_blank"
                        className="action-icon-btn preview"
                        title="View Public Page"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
                      <button
                        type="button"
                        className="action-icon-btn preview"
                        title="Edit Project & Photos"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn delete"
                        title="Delete Project (Free Slot)"
                        onClick={() => handleDeleteProject(p.id, p.title)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>

                  <div className="card-info">
                    <h4 className="card-title" title={p.title}>{p.title}</h4>
                    {p.subtitle && (
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.subtitle}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        style={{
                          flex: 1,
                          padding: '7px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          color: '#334155',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <Link
                        to={`/proposed-projects/${p.id}`}
                        target="_blank"
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '7px',
                          borderRadius: '6px',
                          border: '1px solid #FFC107',
                          background: 'rgba(255, 193, 7, 0.1)',
                          color: '#966e00',
                          fontSize: '12px',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <i className="fa-solid fa-globe"></i> View Page
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Modal (File Upload Only - No URLs, No Samples) */}
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => !submitting && setIsModalOpen(false)}>
            <div
              className="admin-modal-box"
              style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h4>{isEditing ? 'Edit Showcase Project' : 'Add Showcase Project'}</h4>
                  <p>Configure project title, subtitle, cover image, and photo gallery.</p>
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
                {/* Basic Info */}
                <div className="form-group">
                  <label htmlFor="title">Project Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Coastal Villa Concept"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subtitle">Subtitle / Stage Tag</label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    placeholder="e.g., Deep Foundation & Steel Superstructure"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={submitting}
                  />
                </div>

                {/* Primary Cover Photo (File Upload Only) */}
                <div className="form-group">
                  <label>Primary Showcase Cover Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      transition: 'background 0.2s ease'
                    }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> Upload Cover Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleCoverFileUpload}
                        disabled={submitting}
                      />
                    </label>
                    {formData.image ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={buildImageUrl(formData.image) || FALLBACK_IMAGE}
                          alt="Cover Preview"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          style={{ width: '84px', height: '54px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-circle-check"></i> Image selected
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                        No cover file chosen yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Multi-Photo Gallery Section (File Upload Only) */}
                <div className="form-divider" style={{ margin: '14px 0 10px 0' }}>
                  <span>PHOTO GALLERY ({allGalleryPhotos.length} PHOTOS)</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#334155', fontWeight: 600, margin: '0 0 2px 0' }}>
                        Upload Gallery Photos
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        Select image files from your computer for this project's dedicated photo gallery page.
                      </p>
                    </div>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#b58500',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(181, 133, 0, 0.25)',
                      transition: 'all 0.2s ease'
                    }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> Upload Photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleGalleryFileUpload}
                        disabled={submitting}
                      />
                    </label>
                  </div>

                  {/* Thumbnail Strip */}
                  {allGalleryPhotos.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '24px 12px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px dashed #cbd5e1',
                      color: '#94a3b8',
                      fontSize: '13px'
                    }}>
                      <i className="fa-regular fa-images" style={{ fontSize: '24px', marginBottom: '6px', color: '#cbd5e1', display: 'block' }}></i>
                      No additional gallery photos uploaded yet. (The cover photo will be shown by default).
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                      gap: '10px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      padding: '6px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      {allGalleryPhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                          }}
                        >
                          <img
                            src={buildImageUrl(photo.url) || FALLBACK_IMAGE}
                            alt={`Gallery ${idx + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(photo.type, photo.index)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Remove Photo"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <i className="fa-solid fa-check"></i> {isEditing ? 'Save Changes' : 'Create Project'}
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
                src={buildImageUrl(previewImage.image || previewImage.gallery?.[0]) || FALLBACK_IMAGE}
                alt={previewImage.title}
                className="preview-full-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
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
