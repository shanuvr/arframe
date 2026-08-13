import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            navigate('/admin/projects', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/login', {
                username: username,
                password: password
            });

            if (response.data && response.data.message === 'Login successful') {
                localStorage.setItem('user_id', response.data.user_id);
                navigate('/admin/projects', { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
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

                    {error && (
                        <div className="login-error" style={{
                            background: 'rgba(220, 38, 38, 0.1)',
                            color: '#dc2626',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            border: '1px solid rgba(220, 38, 38, 0.3)'
                        }}>
                            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="adminUsername">Username</label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-user input-icon"></i>
                            <input 
                                id="adminUsername"
                                type="text" 
                                placeholder="Enter username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
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
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-gold login-submit-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In to Dashboard <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                            </>
                        )}
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
