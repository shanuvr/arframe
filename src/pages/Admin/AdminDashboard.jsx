import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'design'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // Project Form State
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectForm, setProjectForm] = useState({ title: '', category: 'Luxury Residential', location: '', year: '', image: '', description: '' });

    // Design Form State
    const [showDesignForm, setShowDesignForm] = useState(false);
    const [designForm, setDesignForm] = useState({ title: '', category: 'Spatial & Conceptual', icon: 'fa-compass-drafting', description: '' });

    const handleLogout = () => {
        navigate('/admin');
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        const newProj = {
            id: Date.now(),
            ...projectForm,
            image: projectForm.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'
        };
        setProjects([newProj, ...projects]);
        setProjectForm({ title: '', category: 'Luxury Residential', location: '', year: '', image: '', description: '' });
        setShowProjectForm(false);
    };

    const handleDeleteProject = (id) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    const handleAddDesign = (e) => {
        e.preventDefault();
        const newDesign = {
            id: Date.now(),
            ...designForm
        };
        setDesignItems([newDesign, ...designItems]);
        setDesignForm({ title: '', category: 'Spatial & Conceptual', icon: 'fa-compass-drafting', description: '' });
        setShowDesignForm(false);
    };

    const handleDeleteDesign = (id) => {
        setDesignItems(designItems.filter(d => d.id !== id));
    };

    return (
        <div className="admin-dashboard-container">
            
            {/* Mobile Sidebar Overlay */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar Navigation */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-brand">
                    <i className="fa-solid fa-compass-drafting logo-icon"></i>
                    <div className="logo-text">
                        AFRAME
                        <span>ADMIN PORTAL</span>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <span className="menu-label">CONTENT MANAGEMENT</span>
                    
                    <button 
                        className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }}
                    >
                        <i className="fa-solid fa-city"></i>
                        <span>Projects</span>
                        <span className="badge">{projects.length}</span>
                    </button>

                    <button 
                        className={`menu-item ${activeTab === 'design' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('design'); setIsSidebarOpen(false); }}
                    >
                        <i className="fa-solid fa-pen-ruler"></i>
                        <span>Design Excellence</span>
                        <span className="badge">{designItems.length}</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <div className="user-avatar">AD</div>
                        <div className="user-details">
                            <span className="user-name">Chief Architect</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                
                {/* Header Navbar */}
                <header className="main-header">
                    <div className="header-left">
                        <button 
                            className="mobile-sidebar-toggle" 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <h2>{activeTab === 'projects' ? 'Projects Directory' : 'Design Excellence Catalogue'}</h2>
                    </div>

                    <div className="header-actions">
                        <span className="header-badge">Live System</span>
                        <button 
                            className="btn-gold add-new-btn"
                            onClick={() => {
                                if (activeTab === 'projects') setShowProjectForm(!showProjectForm);
                                else setShowDesignForm(!showDesignForm);
                            }}
                        >
                            <i className="fa-solid fa-plus"></i> 
                            {activeTab === 'projects' 
                                ? (showProjectForm ? 'Close Form' : 'Add New Project') 
                                : (showDesignForm ? 'Close Form' : 'Add New Service')
                            }
                        </button>
                    </div>
                </header>

                {/* Content View */}
                <div className="content-body">

                    {/* ===== TAB 1: PROJECTS ===== */}
                    {activeTab === 'projects' && (
                        <div className="tab-pane fade-in-up">
                            
                            {/* Project Creation Form */}
                            {showProjectForm && (
                                <div className="form-card-container">
                                    <div className="card-header">
                                        <h3>Add New Project Entry</h3>
                                        <p>Fill out the fields to publish a new architectural project to the showcase grid.</p>
                                    </div>
                                    <form className="admin-form" onSubmit={handleAddProject}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Project Title</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Skyline Residence" 
                                                    value={projectForm.title}
                                                    onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select 
                                                    value={projectForm.category}
                                                    onChange={e => setProjectForm({...projectForm, category: e.target.value})}
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
                                                    value={projectForm.location}
                                                    onChange={e => setProjectForm({...projectForm, location: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Completion Year</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. 2024" 
                                                    value={projectForm.year}
                                                    onChange={e => setProjectForm({...projectForm, year: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Image URL</label>
                                                <input 
                                                    type="url" 
                                                    placeholder="https://images.unsplash.com/..." 
                                                    value={projectForm.image}
                                                    onChange={e => setProjectForm({...projectForm, image: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Project Description</label>
                                                <textarea 
                                                    rows="3" 
                                                    placeholder="Key architectural highlights and design summary..."
                                                    value={projectForm.description}
                                                    onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-gold">Save Project</button>
                                            <button type="button" className="btn-cancel" onClick={() => setShowProjectForm(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Projects Table */}
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
                    )}

                    {/* ===== TAB 2: DESIGN EXCELLENCE ===== */}
                    {activeTab === 'design' && (
                        <div className="tab-pane fade-in-up">
                            
                            {/* Design Item Creation Form */}
                            {showDesignForm && (
                                <div className="form-card-container">
                                    <div className="card-header">
                                        <h3>Add New Design Service</h3>
                                        <p>Publish a new design discipline or service capability to the Design Excellence section.</p>
                                    </div>
                                    <form className="admin-form" onSubmit={handleAddDesign}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Service Title</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. 3D Architectural Rendering" 
                                                    value={designForm.title}
                                                    onChange={e => setDesignForm({...designForm, title: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Service Category</label>
                                                <select
                                                    value={designForm.category}
                                                    onChange={e => setDesignForm({...designForm, category: e.target.value})}
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
                                                    value={designForm.icon}
                                                    onChange={e => setDesignForm({...designForm, icon: e.target.value})}
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
                                                    placeholder="Detailed explanation of the design process and benefits..."
                                                    value={designForm.description}
                                                    onChange={e => setDesignForm({...designForm, description: e.target.value})}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-gold">Save Service</button>
                                            <button type="button" className="btn-cancel" onClick={() => setShowDesignForm(false)}>Cancel</button>
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
                    )}

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
