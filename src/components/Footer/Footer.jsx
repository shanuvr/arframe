import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'About Us', to: '/about' },
        { label: 'Projects', to: '/projects' },
        { label: 'Contact Us', to: '/contact' },
    ];

    const services = [
        { label: 'Residential', to: '/projects' },
        { label: 'Commercial', to: '/projects' },
        { label: 'Architecture', to: '/projects' },
        { label: 'Interior Design', to: '/projects' },
    ];

    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo-container">
                        <img src="/logo/logowhite.png" alt="Aframe Builders Logo" className="footer-logo-img" />
                    </Link>
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
                                <Link to={link.to}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h5>Our Services</h5>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}>
                                <Link to={service.to}>{service.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h5>Contact Info</h5>
                    <div className="footer-contact-item">
                        <i className="fa-solid fa-phone"></i>
                        <span>+91 9712337226</span>
                    </div>
                    <div className="footer-contact-item">
                        <i className="fa-solid fa-envelope"></i>
                        <span>aframe.ind@gmail.com</span>
                    </div>
                    <div className="footer-social-icons">
                        <a href="https://www.instagram.com/aframe_builders?stkn=MTA1bXRmdWRoNmQ1cA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                        <a href="https://www.facebook.com/share/1Haa2Earky/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom-bar">
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
