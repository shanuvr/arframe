import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminProjects.css';

const AdminProjects = () => {
    // Static Data: Projects (3 static items)
    const [projects, setProjects] = useState([
        {
            id: 1,
            title: "Aura Modern Villa",
            category: "Luxury Residential",
            location: "Beverly Hills, CA",
            year: "2024",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80",
            description: "Ultra-luxury cliffside residential villa featuring glass facade and infinity pool."
        },
        {
            id: 2,
            title: "Vertex Commercial Tower",
            category: "Commercial Architecture",
            location: "Manhattan, NY",
            year: "2023",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
            description: "High-density corporate skyscraper with sustainable solar glazing."
        },
        {
            id: 3,
            title: "Zenith Glass Pavilion",
            category: "Interior & Exterior",
            location: "Aspen, CO",
            year: "2024",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80",
            description: "Mountain retreat pavilion highlighting natural stone and floor-to-ceiling glass."
        }
    ]);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', category: 'Luxury Residential', location: '', year: '', image: '', description: '' });

    const handleAddProject = (e) => {
        e.preventDefault();
        const newProj = {
            id: Date.now(),
            ...form,
            image: form.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'
        };
        setProjects([newProj, ...projects]);
        setForm({ title: '', category: 'Luxury Residential', location: '', year: '', image: '', description: '' });
        setShowForm(false);
    };

    const handleDeleteProject = (id) => {
        setProjects(projects.filter(p => p.id !== id));
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
                                        value={form.category}
                                        onChange={e => setForm({...form, category: e.target.value})}
                                    >
                                        <option value="Luxury Residential">Luxury Residential</option>
                                        <option value="Commercial Architecture">Commercial Architecture</option>
                                        <option value="Interior & Exterior">Interior & Exterior</option>
                                        <option value="Urban Planning">Urban Planning</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Miami, FL" 
                                        value={form.location}
                                        onChange={e => setForm({...form, location: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Completion Year</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 2024" 
                                        value={form.year}
                                        onChange={e => setForm({...form, year: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Image URL</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://images.unsplash.com/..." 
                                        value={form.image}
                                        onChange={e => setForm({...form, image: e.target.value})}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Project Description</label>
                                    <textarea 
                                        rows="3" 
                                        placeholder="Key architectural highlights and design summary..."
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-gold">Save Project</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
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
                                    <th>Year</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((proj) => (
                                    <tr key={proj.id}>
                                        <td>
                                            <img src={proj.image} alt={proj.title} className="table-thumb" />
                                        </td>
                                        <td>
                                            <strong className="item-title">{proj.title}</strong>
                                            <p className="item-subtext">{proj.description}</p>
                                        </td>
                                        <td><span className="category-pill">{proj.category}</span></td>
                                        <td>{proj.location}</td>
                                        <td>{proj.year}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn edit-btn" title="Edit Item">
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminProjects;
