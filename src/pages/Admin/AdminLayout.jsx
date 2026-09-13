import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children, title }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            navigate('/admin', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        navigate('/admin', { replace: true });
    };

    return (
        <div className="admin-layout-container">
            {/* Mobile Sidebar Backdrop */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Light Theme Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-brand">
                    <div className="brand-logo-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                        <img src="/logo/logodark.png" alt="Aframe Builders Logo" className="admin-logo-img" />
                        <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#b58500', fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: '2px' }}>Admin Portal</span>
                    </div>
                    <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <nav className="sidebar-menu">
                    <span className="menu-label">CONTENT MANAGEMENT</span>
                    
                    <NavLink 
                        to="/admin/projects" 
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <i className="fa-solid fa-city"></i>
                        <span>Projects</span>
                    </NavLink>

                    {/* DESIGN EXCELLENCE admin link commented out */}
                    {/* <NavLink 
                        to="/admin/design-excellence" 
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <i className="fa-solid fa-pen-ruler"></i>
                        <span>Design Excellence</span>
                    </NavLink> */}
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
                {/* Top Header Navbar */}
                <header className="main-header">
                    <div className="header-left">
                        <button 
                            className="mobile-sidebar-toggle" 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            <i className="fa-solid fa-bars-staggered"></i>
                        </button>
                        <div className="header-title-group">
                            <span className="header-category">Admin Control Center</span>
                            <h2>{title}</h2>
                        </div>
                    </div>

                    <div className="header-actions">
                        <Link to="/" target="_blank" className="view-site-btn">
                            <i className="fa-solid fa-globe"></i>
                            <span>View Public Site</span>
                        </Link>
                    </div>
                </header>

                {/* Content Body */}
                <div className="content-body">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
