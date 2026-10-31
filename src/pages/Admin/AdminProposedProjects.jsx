import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getProposedProjects, saveProposedProjects } from '../../data/proposedProjectsData.js';
import './AdminProposedProjects.css';

const DEFAULT_PHASES = [
  'Concept Sketch',
  '3D Visualization',
  'Structural Execution',
  'Interior Detailing',
  'Finished Execution',
];

const SAMPLE_GALLERY_PHOTOS = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
];

const AdminProposedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState('ALL');
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
    phase: 'Concept Sketch',
    image: '',
    description: '',
    location: '',
    builtup_area: '',
    land_area: '',
    structural_type: '',
    timeline: '',
    gallery: [],
  };
  const [formData, setFormData] = useState(initialForm);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

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
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filter projects by search & phase
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phase?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPhase =
        selectedPhaseFilter === 'ALL' || p.phase === selectedPhaseFilter;
      return matchSearch && matchPhase;
    });
  }, [projects, searchQuery, selectedPhaseFilter]);

  // Open modal for Adding
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialForm);
    setNewGalleryUrl('');
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
      description: project.description || '',
      location: project.details?.location || '',
      builtup_area: project.details?.builtup_area || '',
      land_area: project.details?.land_area || '',
      structural_type: project.details?.structural_type || '',
      timeline: project.details?.timeline || '',
      gallery: project.gallery ? [...project.gallery] : (project.image ? [project.image] : []),
    });
    setNewGalleryUrl('');
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

  // Gallery photo management
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleAddSamplePhoto = () => {
    const randomUrl = SAMPLE_GALLERY_PHOTOS[Math.floor(Math.random() * SAMPLE_GALLERY_PHOTOS.length)];
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, randomUrl],
    }));
  };

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

    setSubmitting(true);

    const projectImage = formData.image.trim() || formData.gallery[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const projectGallery = formData.gallery.length > 0 ? formData.gallery : [projectImage];

    const projectPayload = {
      id: isEditing && editingId ? editingId : `proposed-${Date.now()}`,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || `${formData.phase} Showcase`,
      phase: formData.phase,
      image: projectImage,
      description: formData.description.trim() || 'A signature architectural concept designed with meticulous attention to modern space planning and structural innovation.',
      details: {
        location: formData.location.trim() || 'Kerala, India',
        builtup_area: formData.builtup_area.trim() || '4,500 sq.ft',
        land_area: formData.land_area.trim() || '20 Cents',
        structural_type: formData.structural_type.trim() || 'Reinforced Concrete & Steel',
        timeline: formData.timeline.trim() || formData.phase,
      },
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
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProposedProjects(updated);
    showToast(`Removed "${title}" from showcase.`);
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
            background: '#111827',
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
            <i className="fa-solid fa-circle-check"></i>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Control Header */}
        <div className="gallery-mgmt-header">
          <div className="header-meta">
            <h3>Proposed &amp; Ongoing Projects Showcase</h3>
            <p>Manage the 5+ interactive showcase projects displayed on the Home slider and their multi-photo detail pages.</p>
          </div>
          <button
            type="button"
            className="btn-upload-trigger"
            onClick={handleOpenAdd}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Showcase Project</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="gallery-stats-row">
          <div className="stat-card">
            <span className="stat-label">Active Slider Items</span>
            <span className="stat-value">{projects.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Gallery Photos</span>
            <span className="stat-value">
              {projects.reduce((acc, curr) => acc + (curr.gallery?.length || 1), 0)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Showcase Status</span>
            <span className="stat-value" style={{ color: '#10b981', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-circle-check"></i> 5+ Live on Home
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="admin-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', maxWidth: '360px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              <input
                type="text"
                placeholder="Search by title or phase..."
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

          <div className="filter-pill-group">
            <button
              type="button"
              className={`admin-filter-pill ${selectedPhaseFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedPhaseFilter('ALL')}
            >
              All Phases ({projects.length})
            </button>
            {DEFAULT_PHASES.map((phase) => (
              <button
                key={phase}
                type="button"
                className={`admin-filter-pill ${selectedPhaseFilter === phase ? 'active' : ''}`}
                onClick={() => setSelectedPhaseFilter(phase)}
              >
                {phase}
              </button>
            ))}
          </div>

          <span className="filter-count">Showing {filteredProjects.length} of {projects.length} projects</span>
        </div>

        {/* Project Card Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Loading projects...</p>
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
              {searchQuery ? `No project matching "${searchQuery}".` : 'No showcase projects found.'}
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
            {filteredProjects.map((p) => {
              const photoCount = p.gallery?.length || 1;
              return (
                <div key={p.id} className="admin-gallery-card">
                  <div className="card-thumb-wrapper">
                    <img
                      src={p.image || p.gallery?.[0]}
                      alt={p.title}
                      className="card-thumb-img"
                      loading="lazy"
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
                        title="Delete Project"
                        onClick={() => handleDeleteProject(p.id, p.title)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>

                  <div className="card-info">
                    <h4 className="card-title" title={p.title}>{p.title}</h4>
                    {p.subtitle && (
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.subtitle}
                      </p>
                    )}
                    <div className="card-sub-info" style={{ marginTop: '6px' }}>
                      <span><i className="fa-solid fa-location-dot"></i> {p.details?.location || 'Kerala'}</span>
                      <span><i className="fa-solid fa-ruler-combined"></i> {p.details?.builtup_area || 'Custom'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
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

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="admin-modal-overlay" onClick={() => !submitting && setIsModalOpen(false)}>
            <div
              className="admin-modal-box"
              style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h4>{isEditing ? 'Edit Proposed Showcase Project' : 'Add Proposed Showcase Project'}</h4>
                  <p>Configure project information, cover photo, and multi-angle photo gallery.</p>
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
                      placeholder="e.g., Waterfront Modern Villa"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group" style={{ width: '220px' }}>
                    <label htmlFor="phase">Project Phase / Stage</label>
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
                  <label htmlFor="subtitle">Subtitle / Architecture Sub-heading</label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    placeholder="e.g., Architectural Blueprint &amp; Spatial Massing"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={submitting}
                  />
                </div>

                {/* Specs row */}
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g., Kochi Waterfront, Kerala"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="builtup_area">Built-up Area</label>
                    <input
                      type="text"
                      id="builtup_area"
                      name="builtup_area"
                      placeholder="e.g., 5,200 sq.ft"
                      value={formData.builtup_area}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="land_area">Land Extent</label>
                    <input
                      type="text"
                      id="land_area"
                      name="land_area"
                      placeholder="e.g., 24 Cents"
                      value={formData.land_area}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Architectural Concept Narrative</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Describe the architectural concept, materials, and design philosophy..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={submitting}
                  ></textarea>
                </div>

                {/* Cover Photo */}
                <div className="form-group">
                  <label>Primary Slider Cover Photo (URL or Upload)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={handleInputChange}
                      className="form-control flex-1"
                      disabled={submitting}
                    />
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleCoverFileUpload}
                        disabled={submitting}
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={formData.image}
                        alt="Cover Preview"
                        style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Cover Image Preview</span>
                    </div>
                  )}
                </div>

                {/* Multi-Photo Gallery Section */}
                <div className="form-divider" style={{ margin: '10px 0' }}>
                  <span>MULTI-PHOTO GALLERY ({formData.gallery.length} PHOTOS)</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>
                    Add photos that will appear in this project's dedicated sub-page gallery.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Paste Unsplash / Image URL and click Add"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="form-control flex-1"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      disabled={!newGalleryUrl.trim() || submitting}
                      style={{
                        padding: '9px 16px',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa-solid fa-plus"></i> Add URL
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSamplePhoto}
                      disabled={submitting}
                      style={{
                        padding: '9px 14px',
                        background: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                      title="Add a random Unsplash architecture sample"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Sample
                    </button>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '9px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      <i className="fa-solid fa-upload"></i> Upload
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
                    <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', margin: '6px 0' }}>
                      No extra gallery photos added yet. (The cover photo will be used by default).
                    </p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                      gap: '10px',
                      maxHeight: '180px',
                      overflowY: 'auto',
                      padding: '6px'
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
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              cursor: 'pointer'
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
                src={previewImage.image || previewImage.gallery?.[0]}
                alt={previewImage.title}
                className="preview-full-img"
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
