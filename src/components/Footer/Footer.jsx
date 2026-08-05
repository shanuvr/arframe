import React from 'react';
import './Footer.css';

const Footer = () => {
    const quickLinks = [
        { label: 'Home', href: '#' },
        { label: 'About Us', href: '#about' },
        { label: 'Design Excellence', href: '#design' },
        { label: 'Projects', href: '#projects' },
    ];

    const services = [
        { label: 'Residential', href: '#' },
        { label: 'Commercial', href: '#' },
        { label: 'Architecture', href: '#' },
        { label: 'Interior Design', href: '#' },
    ];

    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <div className="logo-container">
                        <i className="fa-solid fa-compass-drafting logo-icon"></i>
                        <div className="logo-text" style={{ color: '#fff' }}>
                            AFRAME
                            <span style={{ color: '#888' }}>BUILDERS</span>
                        </div>
                    </div>
                    <p>
                        A Frame To Transcend Time. Designing and constructing timeless spaces with precision, passion and
                        perfection.
                    </p>
                </div>

                <div className="footer-col">
                    <h5>Quick Links</h5>
                    <ul>
                        {quickLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.href}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h5>Our Services</h5>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}>
                                <a href={service.href}>{service.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h5>Contact Info</h5>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '10px' }}>
                        <i className="fa-solid fa-phone" style={{ color: 'var(--primary)', marginRight: '5px' }}></i> +91
                        9712337226
                    </p>
                    <p style={{ color: '#888', fontSize: '13px' }}>
                        <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', marginRight: '5px' }}></i>
                        aframe.ind@gmail.com
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '0' }}>
                <div className="footer-bottom">
                    <p>&copy; 2026 Aframe Builders. All Rights Reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
