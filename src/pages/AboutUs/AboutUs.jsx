import React, { useEffect } from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="page-hero" style={{ backgroundImage: "url('/1784716807588%281%29%281%29.png')" }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <h1>About <span>Us</span></h1>
            <p>Building the future with excellence and innovation</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section section-padding">
        <div className="container">
          <div className="story-grid">
            <div className="story-text fade-in-left">
              <h2>Our <span>Story</span></h2>
              <p>Founded in 2010, AFRAME Builders has grown from a boutique architectural firm to an industry leader in modern construction and design. We believe that architecture is more than just buildings; it's about creating spaces that inspire and endure.</p>
              <p>Our team of visionary architects, meticulous engineers, and passionate designers work collaboratively to bring extraordinary concepts to life.</p>
            </div>
            <div className="story-image fade-in-right">
              <img src="/1784192661079%281%29.png" alt="Modern Architecture Office" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission-section section-padding">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="card fade-in-up" style={{ animationDelay: '0.2s' }}>
              <i className="fa-solid fa-eye card-icon"></i>
              <h3>Our Vision</h3>
              <p>To redefine urban landscapes with sustainable, innovative, and aesthetically profound architectural solutions that stand the test of time.</p>
            </div>
            <div className="card fade-in-up" style={{ animationDelay: '0.4s' }}>
              <i className="fa-solid fa-bullseye card-icon"></i>
              <h3>Our Mission</h3>
              <p>Delivering uncompromised quality and exceptional design through a client-centric approach, fostering environments where people thrive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section section-padding" style={{ backgroundImage: "url('/1784187873891%281%29.png')" }}>
        <div className="stats-overlay">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">250+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Industry Awards</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay">
          <div className="cta-content fade-in-up">
            <div className="cta-accent-line"></div>
            <span className="cta-label">Turn Vision Into Reality</span>
            <h2>Ready to build your <span>dream project</span>?</h2>
            <p>Contact our team of expert architects and builders for a personalized consultation.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-gold">Get in Touch</Link>
              <Link to="/projects" className="btn-outline-light">Browse Projects</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
