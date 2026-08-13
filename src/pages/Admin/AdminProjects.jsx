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
    const [form, setForm] = useState({ title: '', category_id: '' });
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', category_id: '' });
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');
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
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSubmitError('');

        if (!imageFile) {
            setSubmitError('Please select a project image.');
            setSaving(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('category_id', form.category_id);
            formData.append('project_name', form.title);
            formData.append('image', imageFile);

            const response = await api.post('/api/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setForm({ title: '', category_id: '' });
            setCategories([]);
            setImageFile(null);
            setImagePreview('');
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
        setEditingId(proj.id);
        setEditForm({
            title: proj.project_name || '',
            category_id: proj.category_id ? String(proj.category_id) : ''
        });
        setExistingImage(proj.project_image ? `${IMAGE_BASE_URL}${proj.project_image}` : '');
        setEditImageFile(null);
        setEditImagePreview('');
        setEditError('');
        setEditModalOpen(true);
        if (categories.length === 0) {
            fetchCategories();
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setEditSaving(true);
        setEditError('');

        try {
            const formData = new FormData();
            formData.append('category_id', editForm.category_id);
            formData.append('project_name', editForm.title);
            if (editImageFile) {
                formData.append('image', editImageFile);
            }

            await api.put(`/api/projects/${editingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEditModalOpen(false);
            setEditingId(null);
            setEditForm({ title: '', category_id: '' });
            setEditImageFile(null);
            setEditImagePreview('');
            setExistingImage('');
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
                                        placeholder="e.g. Skyline Residence" 
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
                                <div className="form-group full-width">
                                    <label>Project Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            width: '100%',
                                            background: '#ffffff'
                                        }}
                                    />
                                    {imagePreview && (
                                        <div style={{ marginTop: '12px' }}>
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #d4af37'
                                                }} 
                                            />
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#d4af37' }}></i>
                                            <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading projects...</p>
                                        </td>
                                    </tr>
                                ) : projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                            <i className="fa-solid fa-folder-open" style={{ fontSize: '32px', marginBottom: '12px', color: '#d1d5db' }}></i>
                                            <p>No projects found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((proj) => (
                                        <tr key={proj.id}>
                                            <td>
                                                <img 
                                                    src={proj.project_image ? `${IMAGE_BASE_URL}${proj.project_image}` : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'} 
                                                    alt={proj.project_name} 
                                                    className="table-thumb" 
                                                />
                                            </td>
                                            <td>
                                                <strong className="item-title">{proj.project_name}</strong>
                                            </td>
                                            <td><span className="category-pill">{proj.category_name}</span></td>
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
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Project Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Skyline Residence"
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
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Project Image <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
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
                                    {editImagePreview ? (
                                        <div style={{ marginTop: '12px' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>New Preview:</p>
                                            <img
                                                src={editImagePreview}
                                                alt="New Preview"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '220px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #d4af37'
                                                }}
                                            />
                                        </div>
                                    ) : existingImage && (
                                        <div style={{ marginTop: '12px' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Current Image:</p>
                                            <img
                                                src={existingImage}
                                                alt="Current"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '220px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e5e7eb'
                                                }}
                                            />
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
