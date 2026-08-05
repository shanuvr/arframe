import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="logo-container" onClick={closeMenu}>
                <i className="fa-solid fa-compass-drafting logo-icon"></i>
                <div className="logo-text">
                    AFRAME
                    <span>BUILDERS</span>
                </div>
            </Link>
            
            <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </div>

            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <li><NavLink to="/" end onClick={closeMenu}>HOME</NavLink></li>
                <li><NavLink to="/about" onClick={closeMenu}>ABOUT US</NavLink></li>
                <li><NavLink to="/design" onClick={closeMenu}>DESIGN EXCELLENCE</NavLink></li>
                <li><NavLink to="/projects" onClick={closeMenu}>PROJECTS</NavLink></li>
                <li><NavLink to="/contact" onClick={closeMenu}>CONTACT US</NavLink></li>
                <li className="mobile-btn-container"><Link to="/contact" className="btn-gold" onClick={closeMenu}>Get Consultation</Link></li>
            </ul>
            <Link to="/contact" className="btn-gold desktop-btn">Get Consultation</Link>
        </nav>
    );
};

export default Navbar;
