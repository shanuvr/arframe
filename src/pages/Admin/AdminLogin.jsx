import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Redirect to Admin Projects Page
        navigate('/admin/projects');
    };

    return (
        <div className="admin-login-page">
            <div className="login-backdrop-glow"></div>
            
            <div className="login-card fade-in-up">
                <div className="login-brand">
                    <i className="fa-solid fa-compass-drafting brand-icon"></i>
                    <h2>AFRAME <span>BUILDERS</span></h2>
                    <p className="admin-badge">Control Center</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <h3>Admin Sign In</h3>
                    <p className="form-subtitle">Enter your authorization credentials to manage site content.</p>

                    <div className="form-group">
                        <label htmlFor="adminEmail">Email Address</label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-envelope input-icon"></i>
                            <input 
                                id="adminEmail"
                                type="email" 
                                placeholder="admin@aframebuilders.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="adminPassword">Security Password</label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-lock input-icon"></i>
                            <input 
                                id="adminPassword"
                                type="password" 
                                placeholder="••••••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-gold login-submit-btn">
                        Sign In to Dashboard <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                    </button>
                </form>

                <div className="login-footer">
                    <Link to="/" className="back-to-site">
                        <i className="fa-solid fa-arrow-left"></i> Return to Main Website
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
