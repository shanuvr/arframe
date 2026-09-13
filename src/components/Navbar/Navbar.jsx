import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="logo-container" onClick={closeMenu}>
                    <img src="/logo/logowhite.png" alt="Aframe Builders Logo" className="logo-img" />
                </Link>
                
                <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation">
                    <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </div>

                <ul className="nav-links desktop-nav">
                    <li><NavLink to="/" end>HOME</NavLink></li>
                    <li><NavLink to="/about">ABOUT US</NavLink></li>
                    {/* DESIGN EXCELLENCE link commented out */}
                    {/* <li><NavLink to="/design">DESIGN EXCELLENCE</NavLink></li> */}
                    <li><NavLink to="/projects">PROJECTS</NavLink></li>
                    <li><NavLink to="/contact">CONTACT US</NavLink></li>
                </ul>

                <Link to="/contact" className="btn-gold desktop-btn">Get Consultation</Link>
            </nav>

            {/* Mobile Drawer Overlay Backdrop */}
            <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

            {/* Mobile Slide-Out Drawer */}
            <div className={`mobile-drawer ${isMenuOpen ? 'active' : ''}`}>
                <div className="drawer-header">
                    <Link to="/" className="logo-container" onClick={closeMenu}>
                        <img src="/logo/logowhite.png" alt="Aframe Builders Logo" className="logo-img" />
                    </Link>
                    <button className="drawer-close-btn" onClick={closeMenu} aria-label="Close menu">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <ul className="drawer-nav-links">
                    <li>
                        <NavLink to="/" end onClick={closeMenu}>
                            <i className="fa-solid fa-house nav-icon"></i> HOME
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" onClick={closeMenu}>
                            <i className="fa-solid fa-building-user nav-icon"></i> ABOUT US
                        </NavLink>
                    </li>
                    {/* DESIGN EXCELLENCE link commented out */}
                    {/* <li>
                        <NavLink to="/design" onClick={closeMenu}>
                            <i className="fa-solid fa-pen-ruler nav-icon"></i> DESIGN EXCELLENCE
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="/projects" onClick={closeMenu}>
                            <i className="fa-solid fa-city nav-icon"></i> PROJECTS
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact" onClick={closeMenu}>
                            <i className="fa-solid fa-envelope nav-icon"></i> CONTACT US
                        </NavLink>
                    </li>
                </ul>

                <div className="drawer-footer">
                    <Link to="/contact" className="btn-gold drawer-cta-btn" onClick={closeMenu}>
                        Get Consultation <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                    </Link>
                    <div className="drawer-socials">
                        <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                        <a href="tel:+919712337226" aria-label="Phone"><i className="fa-solid fa-phone"></i></a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
