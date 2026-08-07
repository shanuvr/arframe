import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminDesignExcellence.css';

const AdminDesignExcellence = () => {
    // Static Data: Design Excellence (3 static items)
    const [designItems, setDesignItems] = useState([
        {
            id: 1,
            title: "Architectural Master Planning",
            category: "Spatial & Conceptual",
            icon: "fa-compass-drafting",
            description: "Comprehensive blueprint development and site planning for high-end architectural developments."
        },
        {
            id: 2,
            title: "Sustainable Structural Engineering",
            category: "Engineering & Eco",
            icon: "fa-leaf",
            description: "Eco-friendly structural designs meeting top energy conservation ratings and resilient planning."
        },
        {
            id: 3,
            title: "Luxury Interior Curation",
            category: "Interior Design",
            icon: "fa-couch",
            description: "Bespoke interior finishes, lighting architecture, custom cabinetry, and tailored furnishings."
        }
    ]);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', category: 'Spatial & Conceptual', icon: 'fa-compass-drafting', description: '' });

    const handleAddDesign = (e) => {
        e.preventDefault();
        const newDesign = {
            id: Date.now(),
            ...form
        };
        setDesignItems([newDesign, ...designItems]);
        setForm({ title: '', category: 'Spatial & Conceptual', icon: 'fa-compass-drafting', description: '' });
        setShowForm(false);
    };

    const handleDeleteDesign = (id) => {
        setDesignItems(designItems.filter(d => d.id !== id));
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
                        <form className="admin-form" onSubmit={handleAddDesign}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Service Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 3D Architectural Rendering" 
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Service Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({...form, category: e.target.value})}
                                    >
                                        <option value="Spatial & Conceptual">Spatial & Conceptual</option>
                                        <option value="Engineering & Eco">Engineering & Eco</option>
                                        <option value="Interior Design">Interior Design</option>
                                        <option value="3D Visualization">3D Visualization</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>FontAwesome Icon Class</label>
                                    <select
                                        value={form.icon}
                                        onChange={e => setForm({...form, icon: e.target.value})}
                                    >
                                        <option value="fa-compass-drafting">Drafting (fa-compass-drafting)</option>
                                        <option value="fa-leaf">Eco Leaf (fa-leaf)</option>
                                        <option value="fa-couch">Couch Interior (fa-couch)</option>
                                        <option value="fa-cube">3D Cube (fa-cube)</option>
                                        <option value="fa-ruler-combined">Ruler (fa-ruler-combined)</option>
                                    </select>
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
                                <button type="submit" className="btn-gold">Save Service</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
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
                                    <th>Icon</th>
                                    <th>Service Title</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {designItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="icon-badge">
                                                <i className={`fa-solid ${item.icon}`}></i>
                                            </div>
                                        </td>
                                        <td>
                                            <strong className="item-title">{item.title}</strong>
                                        </td>
                                        <td><span className="category-pill">{item.category}</span></td>
                                        <td className="desc-cell">{item.description}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="action-btn edit-btn" title="Edit Item">
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminDesignExcellence;
