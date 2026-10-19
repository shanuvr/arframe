import React, { useEffect } from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';
import { useHeroImages } from '../../hooks/useHeroImages.js';
import { buildImageUrl } from '../../api/pageSettings.js';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { settings } = useHeroImages();
  const aboutHero = buildImageUrl(settings?.about_hero?.image) || '/pagehero/aboutushero.jpg';

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="page-hero" style={{ backgroundImage: `url('${aboutHero}')` }}>
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
              <span className="section-subtitle">COMPANY OVERVIEW</span>
              <h2>About <span>AFRAME Builders</span></h2>
              <p>Founded in 2020, AFRAME Builders is a full-service architectural design and construction firm based in Thrissur, Kerala. Built on a foundation of uncompromised quality and engineering precision, we deliver complete turn-key solutions spanning residential, commercial, and industrial sectors.</p>
              <p>From conceptual architectural design to structural execution, interior design, and large-scale renovations, our expertise spans a wide range of building styles and structural requirements. We specialize in Pre-Engineered Building (PEB) structures and reinforced concrete (RCC) construction for industrial plants, godowns, and commercial spaces, backed by a dedicated team equipped to handle complex engineering and regulatory approval workflows.</p>
              <p>Driven by our core vision&mdash;<strong>&ldquo;A frame to transcend time&rdquo;</strong>&mdash;we focus on rigorous material standards, precision execution, and structural integrity to create spaces built to last for generations.</p>
              <p className="story-tagline"><strong>AFRAME Builders &mdash; driven by our core vision, &ldquo;A frame to transcend time.&rdquo;</strong></p>
            </div>
            <div className="story-image fade-in-right">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" alt="Modern Architecture Office" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission-section section-padding">
        <div className="container">
          <div className="section-header text-center fade-in-up">
            <span className="section-subtitle">STRATEGIC DIRECTION</span>
            <h2>Vision &amp; <span>Mission</span></h2>
            <div className="section-header-line"></div>
          </div>

          <div className="vision-mission-grid">
            <div className="vm-card fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="vm-card-top">
                <div className="vm-icon-box">
                  <i className="fa-solid fa-eye"></i>
                </div>
                <span className="vm-badge">Our Vision</span>
              </div>

              <div className="vm-card-body">
                <h3 className="vm-card-title">Vision Statement</h3>
                <div className="vm-quote-wrap">
                  <p className="vm-quote-text">
                    &ldquo;To evolve into a leading national and international infrastructure powerhouse, renowned for mastering highly complex engineering challenges&mdash;from iconic architectural landmarks and institutional campuses to mega-development projects&mdash;while setting global benchmarks in structural integrity, innovation, and timeless design.&rdquo;
                  </p>
                </div>
              </div>

              <div className="vm-card-footer">
                <span className="vm-footer-pill">
                  <i className="fa-solid fa-gem"></i> Global Benchmarks &bull; Timeless Design
                </span>
              </div>
            </div>

            <div className="vm-card fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="vm-card-top">
                <div className="vm-icon-box">
                  <i className="fa-solid fa-bullseye"></i>
                </div>
                <span className="vm-badge">Our Mission</span>
              </div>

              <div className="vm-card-body">
                <h3 className="vm-card-title">Mission Statement</h3>
                <div className="vm-quote-wrap">
                  <p className="vm-quote-text">
                    &ldquo;At AFRAME Builders, our mission is to redefine the future of infrastructure by leveraging a world-class team of architects and engineers to execute complex, large-scale projects across national and global frontiers. Driven by our belief in &lsquo;a frame to transcend time,&rsquo; we commit to uncompromised precision, engineering excellence, and end-to-end delivery&mdash;building iconic structures and critical infrastructure engineered to serve generations.&rdquo;
                  </p>
                </div>
              </div>

              <div className="vm-card-footer">
                <span className="vm-footer-pill">
                  <i className="fa-solid fa-compass-drafting"></i> Engineering Precision &bull; End-to-End Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section section-padding" style={{ backgroundImage: "url('/52138.jpeg')" }}>
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
