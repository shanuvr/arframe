import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../api/axios.js';
import './AdminDesignExcellence.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const AdminDesignExcellence = () => {
    const navigate = useNavigate();
    const [designItems, setDesignItems] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Add Form State
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '' });
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState('');

    const fetchDesignExcellence = async (pageNum = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/design-excellence?page=${pageNum}&limit=5`);
            if (response.data) {
                setDesignItems(response.data.data || []);
                setPage(response.data.page || 1);
                setLimit(response.data.limit || 5);
                setTotal(response.data.total || 0);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (err) {
            console.error('Failed to fetch design excellence:', err);
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
        fetchDesignExcellence(1);
    }, [navigate]);

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

    const handleAddDesign = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSubmitError('');

        if (!imageFile) {
            setSubmitError('Please select an excellence image.');
            setSaving(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('excellence_name', form.title);
            formData.append('excellence_description', form.description);
            formData.append('image', imageFile);

            await api.post('/api/design-excellence', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setForm({ title: '', description: '' });
            setImageFile(null);
            setImagePreview('');
            setShowForm(false);
            fetchDesignExcellence(1);
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to save service. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDesign = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }
        try {
            await api.delete(`/api/design-excellence/${id}`);
            fetchDesignExcellence(page);
        } catch (err) {
            console.error('Failed to delete design excellence:', err);
            fetchDesignExcellence(page);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({
            title: item.excellence_name || item.title || '',
            description: item.excellence_description || item.description || ''
        });
        setExistingImage(item.excellence_image ? `${IMAGE_BASE_URL}${item.excellence_image}` : '');
        setEditImageFile(null);
        setEditImagePreview('');
        setEditError('');
        setEditModalOpen(true);
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

    const handleUpdateDesign = async (e) => {
        e.preventDefault();
        setEditSaving(true);
        setEditError('');

        try {
            const formData = new FormData();
            formData.append('excellence_name', editForm.title);
            formData.append('excellence_description', editForm.description);
            if (editImageFile) {
                formData.append('image', editImageFile);
            }

            await api.put(`/api/design-excellence/${editingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEditModalOpen(false);
            setEditingId(null);
            setEditForm({ title: '', description: '' });
            setEditImageFile(null);
            setEditImagePreview('');
            setExistingImage('');
            fetchDesignExcellence(page);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update service. Please try again.');
        } finally {
            setEditSaving(false);
        }
    };

    return (
        <AdminLayout title="Manage Design Excellence">
            <div className="admin-design-page fade-in-up">
                
                {/* Page Action Top Bar */}
                <div className="page-action-header">
                    <div>
                        <h3>Design Excellence Catalogue</h3>
                        <p className="page-subtext">Manage, structure, and publish core design disciplines & engineering capabilities.</p>
                    </div>
                    <button 
                        className="btn-gold add-service-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus'}`}></i> 
                        {showForm ? 'Close Form' : 'Add New Service'}
                    </button>
                </div>

                {/* Form Card */}
                {showForm && (
                    <div className="form-card-container">
                        <div className="card-header">
                            <h4>Add New Design Service</h4>
                            <p>Publish a new design capability or architectural discipline to the Design Excellence section.</p>
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
                        <form className="admin-form" onSubmit={handleAddDesign}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Service Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Architectural Master Planning" 
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Excellence Image</label>
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
                                <div className="form-group full-width">
                                    <label>Service Summary</label>
                                    <textarea 
                                        rows="3" 
                                        placeholder="Detailed explanation of the design process and key client benefits..."
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        required
                                    ></textarea>
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
                                        'Save Service'
                                    )}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Design Excellence Table */}
                <div className="table-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Excellence Image</th>
                                    <th>Service Title</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#d4af37' }}></i>
                                            <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading services...</p>
                                        </td>
                                    </tr>
                                ) : designItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                            <i className="fa-solid fa-folder-open" style={{ fontSize: '32px', marginBottom: '12px', color: '#d1d5db' }}></i>
                                            <p>No services found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    designItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <img
                                                    src={item.excellence_image ? `${IMAGE_BASE_URL}${item.excellence_image}` : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
                                                    alt={item.excellence_name || item.title}
                                                    className="table-thumb"
                                                />
                                            </td>
                                            <td>
                                                <strong className="item-title">{item.excellence_name || item.title}</strong>
                                            </td>
                                            <td className="desc-cell">{item.excellence_description || item.description}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn edit-btn" title="Edit Item" onClick={() => handleEditClick(item)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button 
                                                        className="action-btn delete-btn" 
                                                        title="Delete Item"
                                                        onClick={() => handleDeleteDesign(item.id)}
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
                                Showing <strong>{designItems.length}</strong> of <strong>{total}</strong> services
                                &nbsp;•&nbsp; Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={() => fetchDesignExcellence(1)}
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
                                    onClick={() => fetchDesignExcellence(page - 1)}
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
                                        onClick={() => fetchDesignExcellence(p)}
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
                                    onClick={() => fetchDesignExcellence(page + 1)}
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
                                    onClick={() => fetchDesignExcellence(totalPages)}
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
                                <h4 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>Edit Service</h4>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>Update the design excellence details below.</p>
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

                        <form onSubmit={handleUpdateDesign} style={{ padding: '24px 28px' }}>
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
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Service Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Architectural Master Planning"
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
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Excellence Image <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
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

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Service Summary</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Detailed explanation of the design process and key client benefits..."
                                        value={editForm.description}
                                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                                        required
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
                                        'Update Service'
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

export default AdminDesignExcellence;
