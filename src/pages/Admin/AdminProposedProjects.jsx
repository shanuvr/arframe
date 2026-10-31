import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getProposedProjects, saveProposedProjects, MAX_PROPOSED_PROJECTS } from '../../data/proposedProjectsData.js';
import './AdminProposedProjects.css';

const DEFAULT_PHASES = [
  'Concept Sketch',
  '3D Visualization',
  'Structural Execution',
  'Interior Detailing',
  'Finished Execution',
];

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

  // Simplified Form State (only Title, Subtitle, Phase, Image, Gallery)
  const initialForm = {
    title: '',
    subtitle: '',
    phase: 'Concept Sketch',
    image: '',
    gallery: [],
  };
  const [formData, setFormData] = useState(initialForm);

  // Load from local store
  const loadProjects = useCallback(() => {
    setLoading(true);
    const data = getProposedProjects();
    setProjects(data);
    setLoading(false);
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
    setFormData({
      title: project.title || '',
      subtitle: project.subtitle || '',
      phase: project.phase || 'Concept Sketch',
      image: project.image || '',
      gallery: project.gallery ? [...project.gallery] : (project.image ? [project.image] : []),
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Gallery multiple file upload
  const handleGalleryFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveGalleryPhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Submit Add or Edit
  const handleSubmit = (e) => {
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

    const projectImage = formData.image || formData.gallery[0] || FALLBACK_IMAGE;
    const projectGallery = formData.gallery.length > 0 ? formData.gallery : [projectImage];

    const projectPayload = {
      id: isEditing && editingId ? editingId : `proposed-${Date.now()}`,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || `${formData.phase} Showcase`,
      phase: formData.phase,
      image: projectImage,
      gallery: projectGallery,
    };

    let updatedList;
    if (isEditing) {
      updatedList = projects.map((p) => (p.id === editingId ? projectPayload : p));
      showToast(`Updated "${projectPayload.title}" successfully!`);
    } else {
      updatedList = [...projects, projectPayload];
      showToast(`Added "${projectPayload.title}" to showcase!`);
    }

    setProjects(updatedList);
    saveProposedProjects(updatedList);
    setIsModalOpen(false);
    setSubmitting(false);
  };

  // Delete project
  const handleDeleteProject = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will free up a slot in the 5-project showcase.`)) {
      return;
    }

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProposedProjects(updated);
    showToast(`Removed "${title}". You can now add a new project slot.`);
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
                      src={p.image || p.gallery?.[0] || FALLBACK_IMAGE}
                      alt={p.title}
                      className="card-thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    {p.phase && (
                      <span className="thumb-badge">{p.phase}</span>
                    )}
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
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="title">Project Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="e.g., Structural Execution"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group" style={{ width: '220px' }}>
                    <label htmlFor="phase">Project Stage / Phase</label>
                    <select
                      id="phase"
                      name="phase"
                      value={formData.phase}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={submitting}
                    >
                      {DEFAULT_PHASES.map((phase) => (
                        <option key={phase} value={phase}>{phase}</option>
                      ))}
                    </select>
                  </div>
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
                          src={formData.image}
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
                  <span>PHOTO GALLERY ({formData.gallery.length} PHOTOS)</span>
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
                  {formData.gallery.length === 0 ? (
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
                      {formData.gallery.map((photoUrl, idx) => (
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
                            src={photoUrl}
                            alt={`Gallery ${idx + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
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
                src={previewImage.image || previewImage.gallery?.[0] || FALLBACK_IMAGE}
                alt={previewImage.title}
                className="preview-full-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              <div className="preview-footer">
                <span className="preview-tag">{previewImage.phase}</span>
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
