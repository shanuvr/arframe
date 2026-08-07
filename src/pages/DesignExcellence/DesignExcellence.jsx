import React, { useEffect } from 'react';
import './DesignExcellence.css';
import { Link } from 'react-router-dom';

const DesignExcellencePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    { icon: 'fa-pen-ruler', title: 'Architecture Services', desc: 'Conceptual design, schematic development, and construction documents.' },
    { icon: 'fa-couch', title: 'Interior Design', desc: 'Curating bespoke interiors that harmonize with architectural aesthetics.' },
    { icon: 'fa-tree-city', title: 'Exterior Design', desc: 'Crafting stunning facades and sustainable landscaping solutions.' },
    { icon: 'fa-vr-cardboard', title: '3D Visualization', desc: 'Immersive virtual reality walkthroughs and photorealistic renders.' },
    { icon: 'fa-map-location-dot', title: 'Master Planning', desc: 'Strategic land use, zoning analysis, and large-scale urban planning.' },
    { icon: 'fa-helmet-safety', title: 'Construction Management', desc: 'Ensuring seamless execution from groundbreaking to final handover.' },
  ];

  const process = [
    { step: '01', title: 'Consultation & Briefing', desc: 'Understanding your vision, requirements, and constraints.' },
    { step: '02', title: 'Concept Design', desc: 'Developing initial sketches and architectural directions.' },
    { step: '03', title: 'Design Development', desc: 'Refining the design and integrating engineering systems.' },
    { step: '04', title: 'Construction Documents', desc: 'Creating detailed technical drawings for execution.' },
  ];

  return (
    <div className="page-container">
      <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')" }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <h1>Design <span>Excellence</span></h1>
            <p>Elevating spaces through meticulous design and innovation</p>
          </div>
        </div>
      </section>

      <section className="services-section section-padding">
        <div className="container">
          <div className="section-header text-center fade-in-up">
            <h2>Our <span>Expertise</span></h2>
            <p className="subtitle">Comprehensive solutions for exceptional results</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card fade-in-up" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <i className={`fa-solid ${service.icon} service-icon`}></i>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section section-padding">
        <div className="container">
          <div className="process-grid">
            <div className="process-image fade-in-left">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop" alt="Architectural Blueprint" />
            </div>
            <div className="process-content fade-in-right">
              <h2>Our <span>Process</span></h2>
              <p className="process-intro">A systematic approach to bringing your architectural dreams to reality.</p>
              
              <div className="timeline">
                {process.map((item, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-number">{item.step}</div>
                    <div className="timeline-text">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="cta-overlay">
          <div className="cta-content fade-in-up">
            <div className="cta-accent-line"></div>
            <span className="cta-label">Let's Build Together</span>
            <h2>Start your <span>design journey</span></h2>
            <p>Let's collaborate to create something extraordinary — from concept to completion.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-gold">Book a Consultation</Link>
              <Link to="/projects" className="btn-outline-light">View Our Work</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignExcellencePage;
