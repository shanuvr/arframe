import React, { useEffect, useState, useRef, useCallback } from 'react';
import './DesignExcellence.css';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const DesignExcellencePage = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchServices = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/design-excellence?page=${pageNum}&limit=6`);
      if (response.data) {
        const newItems = response.data.data || [];
        setServices(prev => pageNum === 1 ? newItems : [...prev, ...newItems]);
        setPage(response.data.page || 1);
        setHasMore(pageNum < (response.data.totalPages || 1));
      }
    } catch (err) {
      console.error('Failed to fetch design excellence:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(1);
  }, [fetchServices]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchServices(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [page, hasMore, loading, fetchServices]);

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
              <div className="service-card fade-in-up" key={service.id || index} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="service-image-wrap" style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '2px solid rgba(212, 175, 55, 0.2)' }}>
                  <img
                    src={service.excellence_image ? `${IMAGE_BASE_URL}${service.excellence_image}` : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                    alt={service.excellence_name || 'Service'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <h3>{service.excellence_name}</h3>
                <p>{service.excellence_description}</p>
              </div>
            ))}
          </div>

          <div ref={loaderRef} style={{ textAlign: 'center', padding: '40px 20px 0 20px' }}>
            {loading && (
              <div>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px', color: '#d4af37' }}></i>
                <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading more services...</p>
              </div>
            )}
            {!hasMore && services.length > 0 && (
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>— You've reached the end —</p>
            )}
            {!loading && services.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: '16px', padding: '40px 0' }}>No services found.</p>
            )}
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
