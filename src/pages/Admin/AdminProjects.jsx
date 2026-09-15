import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import './AdminProjects.css';

const AdminProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Add Form State
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', category_id: '', description: '', client: '', location: '', builtup_area: '', land_area: '' });
    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [addCoverIndex, setAddCoverIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', category_id: '', description: '', client: '', location: '', builtup_area: '', land_area: '' });
    const [existingImages, setExistingImages] = useState([]);
    const [removedExisting, setRemovedExisting] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [selectedCoverKey, setSelectedCoverKey] = useState(null);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState('');

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

    const fetchProjects = async (pageNum = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/projects?page=${pageNum}`);
            if (response.data) {
                setProjects(response.data.data || []);
                setPage(response.data.page || 1);
                setLimit(response.data.limit || 5);
                setTotal(response.data.total || 0);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (err) {
            console.error('Failed to fetch projects:', err);
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
        fetchProjects(1);
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories');
            if (response.data && response.data.data) {
                setCategories(response.data.data);
                if (response.data.data.length > 0 && !form.category_id) {
                    setForm(prev => ({ ...prev, category_id: response.data.data[0].id }));
                }
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    useEffect(() => {
        if (showForm) {
            fetchCategories();
        }
    }, [showForm]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            setImageFiles(prev => [...prev, ...files]);
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = '';
    };

    const removeNewImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (addCoverIndex >= index && addCoverIndex > 0) {
            setAddCoverIndex(prev => prev - 1);
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSubmitError('');

        if (imageFiles.length === 0) {
            setSubmitError('Please select at least one project photo.');
            setSaving(false);
            return;
        }

        try {
            // Reorder image files so cover image is first
            const orderedFiles = [...imageFiles];
            if (addCoverIndex > 0 && addCoverIndex < orderedFiles.length) {
                const coverFile = orderedFiles.splice(addCoverIndex, 1)[0];
                orderedFiles.unshift(coverFile);
            }

            const formData = new FormData();
            formData.append('category_id', form.category_id);
            formData.append('project_name', form.title);
            formData.append('description', form.description);
            formData.append('client', form.client);
            formData.append('location', form.location);
            formData.append('builtup_area', form.builtup_area);
            formData.append('land_area', form.land_area);
            orderedFiles.forEach((file) => formData.append('images', file));
            formData.append('image', orderedFiles[0]);

            await api.post('/api/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setForm({ title: '', category_id: '', description: '', client: '', location: '', builtup_area: '', land_area: '' });
            setCategories([]);
            setImageFiles([]);
            setImagePreviews([]);
            setAddCoverIndex(0);
            setShowForm(false);
            fetchProjects(1);
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to save project. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }
        try {
            await api.delete(`/api/projects/${id}`);
            fetchProjects(page);
        } catch (err) {
            console.error('Failed to delete project:', err);
            fetchProjects(page);
        }
    };

    const handleEditClick = (proj) => {
        const projImages = proj.images && proj.images.length > 0
            ? proj.images
            : (proj.project_image ? [proj.project_image] : []);

        const initialCoverKey = proj.project_image || (projImages[0] || null);

        setEditingId(proj.id);
        setEditForm({
            title: proj.project_name || '',
            category_id: proj.category_id ? String(proj.category_id) : '',
            description: proj.description || '',
            client: proj.client || '',
            location: proj.location || '',
            builtup_area: proj.builtup_area || '',
            land_area: proj.land_area || ''
        });
        setExistingImages(projImages.map((key) => ({ key, url: `${IMAGE_BASE_URL}${key}` })));
        setRemovedExisting([]);
        setNewImageFiles([]);
        setNewImagePreviews([]);
        setSelectedCoverKey(initialCoverKey);
        setEditError('');
        setEditModalOpen(true);
        if (categories.length === 0) {
            fetchCategories();
        }
    };

    const handleEditImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            setNewImageFiles(prev => [...prev, ...files]);
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewImagePreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = '';
    };

    const removeNewEditImage = (index) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (selectedCoverKey === `NEW_${index}`) {
            setSelectedCoverKey(null);
        }
    };

    const removeExistingImage = (key) => {
        setRemovedExisting(prev => [...prev, key]);
        if (selectedCoverKey === key) {
            setSelectedCoverKey(null);
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setEditSaving(true);
        setEditError('');

        const keptKeys = existingImages
            .filter(img => !removedExisting.includes(img.key))
            .map(img => img.key);

        if (keptKeys.length === 0 && newImageFiles.length === 0) {
            setEditError('A project must keep or add at least one photo.');
            setEditSaving(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('category_id', editForm.category_id);
            formData.append('project_name', editForm.title);
            formData.append('description', editForm.description);
            formData.append('client', editForm.client);
            formData.append('location', editForm.location);
            formData.append('builtup_area', editForm.builtup_area);
            formData.append('land_area', editForm.land_area);
            if (selectedCoverKey) {
                formData.append('cover_image_key', selectedCoverKey);
            }

            keptKeys.forEach((key) => formData.append('keep_images', key));
            newImageFiles.forEach((file) => formData.append('images', file));
            if (newImageFiles.length > 0) {
                formData.append('image', newImageFiles[0]);
            }

            await api.put(`/api/projects/${editingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEditModalOpen(false);
            setEditingId(null);
            setEditForm({ title: '', category_id: '', description: '', client: '', location: '', builtup_area: '', land_area: '' });
            setExistingImages([]);
            setRemovedExisting([]);
            setNewImageFiles([]);
            setNewImagePreviews([]);
            setSelectedCoverKey(null);
            fetchProjects(page);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update project. Please try again.');
        } finally {
            setEditSaving(false);
        }
    };

    return (
        <AdminLayout title="Manage Projects">
            <div className="admin-projects-page fade-in-up">
                
                {/* Page Action Top Bar */}
                <div className="page-action-header">
                    <div>
                        <h3>Projects Directory</h3>
                        <p className="page-subtext">Manage, publish, and structure featured architectural projects.</p>
                    </div>
                    <button 
                        className="btn-gold add-project-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus'}`}></i> 
                        {showForm ? 'Close Form' : 'Add New Project'}
                    </button>
                </div>

                {/* Form Card */}
                {showForm && (
                    <div className="form-card-container">
                        <div className="card-header">
                            <h4>Add New Project Entry</h4>
                            <p>Fill out the fields to publish a new architectural project to the public showcase.</p>
                        </div>
                        {submitError && (
                            <div style={{
                                background: 'rgba(220, 38, 38, 0.1)',
                                color: '#dc2626',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                fontSize: '14px',
                                border: '1px solid rgba(220, 38, 38, 0.3)'
                            }}>
                                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                                {submitError}
                            </div>
                        )}
                        <form className="admin-form" onSubmit={handleAddProject}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Project Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Residence Aadimadhavam" 
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select 
                                        value={form.category_id}
                                        onChange={e => setForm({...form, category_id: e.target.value})}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Ammadam, Thrissur" 
                                        value={form.location}
                                        onChange={e => setForm({...form, location: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Client</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Mr Pradeep" 
                                        value={form.client}
                                        onChange={e => setForm({...form, client: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Built-up Area</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 2850 Sqft" 
                                        value={form.builtup_area}
                                        onChange={e => setForm({...form, builtup_area: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Land Area</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 50 Cent" 
                                        value={form.land_area}
                                        onChange={e => setForm({...form, land_area: e.target.value})}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Project Description</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="Detailed story of the project — its concept, materials, and design intent..."
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>Project Photos <span style={{ fontWeight: 400 }}>(first photo becomes the cover)</span></label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            width: '100%',
                                            background: '#ffffff'
                                        }}
                                    />
                                    {imagePreviews.length > 0 && (
                                        <div className="photo-preview-grid">
                                            {imagePreviews.map((src, i) => {
                                                const isCover = i === addCoverIndex;
                                                return (
                                                    <div className={`photo-preview-item ${isCover ? 'is-cover' : ''}`} key={i}>
                                                        <img src={src} alt={`Photo ${i + 1} preview`} />
                                                        {isCover ? (
                                                            <span className="cover-badge"><i className="fa-solid fa-star"></i> Cover</span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="make-cover-btn"
                                                                title="Set as Cover Image"
                                                                onClick={() => setAddCoverIndex(i)}
                                                            >
                                                                <i className="fa-regular fa-star"></i> Make Cover
                                                            </button>
                                                        )}
                                                        <button type="button" className="remove-photo-btn" title="Remove photo" onClick={() => removeNewImage(i)}>
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-gold" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Project'
                                    )}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Projects Data Table */}
                <div className="table-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Thumbnail</th>
                                    <th>Project Title</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Photos</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#d4af37' }}></i>
                                            <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading projects...</p>
                                        </td>
                                    </tr>
                                ) : projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                            <i className="fa-solid fa-folder-open" style={{ fontSize: '32px', marginBottom: '12px', color: '#d1d5db' }}></i>
                                            <p>No projects found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((proj) => (
                                        <tr key={proj.id}>
                                            <td>
                                                <img 
                                                    src={proj.project_image ? `${IMAGE_BASE_URL}${proj.project_image}` : (proj.images && proj.images[0] ? `${IMAGE_BASE_URL}${proj.images[0]}` : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80')} 
                                                    alt={proj.project_name} 
                                                    className="table-thumb" 
                                                />
                                            </td>
                                            <td>
                                                <strong className="item-title">{proj.project_name}</strong>
                                                {proj.description && (
                                                    <p className="item-subtext">{proj.description}</p>
                                                )}
                                            </td>
                                            <td><span className="category-pill">{proj.category_name}</span></td>
                                            <td>{proj.location || '—'}</td>
                                            <td>
                                                <span className="photo-count-pill">
                                                    <i className="fa-solid fa-image"></i> 
                                                    {proj.images ? proj.images.length : (proj.project_image ? 1 : 0)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn edit-btn" title="Edit Item" onClick={() => handleEditClick(proj)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button 
                                                        className="action-btn delete-btn" 
                                                        title="Delete Item"
                                                        onClick={() => handleDeleteProject(proj.id)}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 0 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 20px',
                            borderTop: '1px solid #e5e7eb',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                Showing <strong>{projects.length}</strong> of <strong>{total}</strong> projects
                                &nbsp;•&nbsp; Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={() => fetchProjects(1)}
                                    disabled={page === 1 || loading}
                                    style={{
                                        padding: '8px 14px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        background: page === 1 ? '#f9fafb' : '#ffffff',
                                        color: page === 1 ? '#9ca3af' : '#374151',
                                        cursor: page === 1 || loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i className="fa-solid fa-angles-left"></i>
                                </button>
                                <button
                                    onClick={() => fetchProjects(page - 1)}
                                    disabled={page === 1 || loading}
                                    style={{
                                        padding: '8px 14px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        background: page === 1 ? '#f9fafb' : '#ffffff',
                                        color: page === 1 ? '#9ca3af' : '#374151',
                                        cursor: page === 1 || loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i className="fa-solid fa-angle-left"></i>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => fetchProjects(p)}
                                        disabled={loading}
                                        style={{
                                            padding: '8px 14px',
                                            border: page === p ? '1px solid transparent' : '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            background: page === p ? '#d4af37' : '#ffffff',
                                            color: page === p ? '#ffffff' : '#374151',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: page === p ? 600 : 400
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => fetchProjects(page + 1)}
                                    disabled={page === totalPages || loading}
                                    style={{
                                        padding: '8px 14px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        background: page === totalPages ? '#f9fafb' : '#ffffff',
                                        color: page === totalPages ? '#9ca3af' : '#374151',
                                        cursor: page === totalPages || loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i className="fa-solid fa-angle-right"></i>
                                </button>
                                <button
                                    onClick={() => fetchProjects(totalPages)}
                                    disabled={page === totalPages || loading}
                                    style={{
                                        padding: '8px 14px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        background: page === totalPages ? '#f9fafb' : '#ffffff',
                                        color: page === totalPages ? '#9ca3af' : '#374151',
                                        cursor: page === totalPages || loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i className="fa-solid fa-angles-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {editModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }} onClick={() => !editSaving && setEditModalOpen(false)}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                        animation: 'fadeInUp 0.3s ease-out'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            padding: '24px 28px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>Edit Project</h4>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Update the project details below.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => !editSaving && setEditModalOpen(false)}
                                disabled={editSaving}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '22px',
                                    color: '#9ca3af',
                                    cursor: editSaving ? 'not-allowed' : 'pointer',
                                    padding: '4px 10px',
                                    borderRadius: '6px'
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProject} style={{ padding: '24px 28px' }}>
                            {editError && (
                                <div style={{
                                    background: 'rgba(220, 38, 38, 0.1)',
                                    color: '#dc2626',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    fontSize: '14px',
                                    border: '1px solid rgba(220, 38, 38, 0.3)'
                                }}>
                                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                                    {editError}
                                </div>
                            )}

                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div className="edit-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', boxSizing: 'border-box' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Project Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Residence Aadimadhavam"
                                            value={editForm.title}
                                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Category</label>
                                        <select
                                            value={editForm.category_id}
                                            onChange={e => setEditForm({...editForm, category_id: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                background: '#ffffff',
                                                boxSizing: 'border-box'
                                            }}
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Ammadam, Thrissur"
                                            value={editForm.location}
                                            onChange={e => setEditForm({...editForm, location: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Client</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Mr Pradeep"
                                            value={editForm.client}
                                            onChange={e => setEditForm({...editForm, client: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Built-up Area</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 2850 Sqft"
                                            value={editForm.builtup_area}
                                            onChange={e => setEditForm({...editForm, builtup_area: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Land Area</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 50 Cent"
                                            value={editForm.land_area}
                                            onChange={e => setEditForm({...editForm, land_area: e.target.value})}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Project Description</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Detailed story of the project — its concept, materials, and design intent..."
                                        value={editForm.description}
                                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                            fontFamily: 'inherit'
                                        }}
                                    ></textarea>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Project Photos <span style={{ color: '#9ca3af', fontWeight: 400 }}>(first photo is the cover)</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleEditImageChange}
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            width: '100%',
                                            background: '#ffffff',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    {existingImages.length > 0 && (
                                        <div style={{ marginTop: '12px' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Current Photos:</p>
                                            <div className="photo-preview-grid">
                                                {existingImages.map((img, i) => {
                                                    const isRemoved = removedExisting.includes(img.key);
                                                    const isCover = selectedCoverKey === img.key || (!selectedCoverKey && i === 0 && !isRemoved);
                                                    return (
                                                        <div className={`photo-preview-item ${isRemoved ? 'removing' : ''} ${isCover ? 'is-cover' : ''}`} key={img.key}>
                                                            <img src={img.url} alt={`Current photo ${i + 1}`} />
                                                            {isCover && !isRemoved && <span className="cover-badge"><i className="fa-solid fa-star"></i> Cover</span>}
                                                            {isRemoved && <span className="removing-badge">Removed</span>}
                                                            {!isCover && !isRemoved && (
                                                                <button
                                                                    type="button"
                                                                    className="make-cover-btn"
                                                                    title="Set as Cover Image"
                                                                    onClick={() => setSelectedCoverKey(img.key)}
                                                                >
                                                                    <i className="fa-regular fa-star"></i> Make Cover
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="remove-photo-btn"
                                                                title={isRemoved ? 'Undo remove' : 'Remove photo'}
                                                                onClick={() => isRemoved
                                                                    ? setRemovedExisting(prev => prev.filter(k => k !== img.key))
                                                                    : removeExistingImage(img.key)}
                                                            >
                                                                <i className={`fa-solid ${isRemoved ? 'fa-rotate-left' : 'fa-xmark'}`}></i>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {newImagePreviews.length > 0 && (
                                        <div style={{ marginTop: '12px' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>New Photos:</p>
                                            <div className="photo-preview-grid">
                                                {newImagePreviews.map((src, i) => {
                                                    const isCover = selectedCoverKey === `NEW_${i}`;
                                                    return (
                                                        <div className={`photo-preview-item ${isCover ? 'is-cover' : ''}`} key={i}>
                                                            <img src={src} alt={`New photo ${i + 1}`} />
                                                            {isCover ? (
                                                                <span className="cover-badge"><i className="fa-solid fa-star"></i> Cover</span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="make-cover-btn"
                                                                    title="Set as Cover Image"
                                                                    onClick={() => setSelectedCoverKey(`NEW_${i}`)}
                                                                >
                                                                    <i className="fa-regular fa-star"></i> Make Cover
                                                                </button>
                                                            )}
                                                            <button type="button" className="remove-photo-btn" title="Remove photo" onClick={() => removeNewEditImage(i)}>
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                marginTop: '28px',
                                paddingTop: '20px',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setEditModalOpen(false)}
                                    disabled={editSaving}
                                    style={{ padding: '10px 20px', borderRadius: '8px', cursor: editSaving ? 'not-allowed' : 'pointer', border: '1px solid #d1d5db', background: '#f9fafb', color: '#374151', fontSize: '14px', fontWeight: 500 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editSaving}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        cursor: editSaving ? 'not-allowed' : 'pointer',
                                        border: 'none',
                                        background: '#d4af37',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        fontWeight: 600
                                    }}
                                >
                                    {editSaving ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Project'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProjects;
