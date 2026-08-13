import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProjects = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/projects?page=${pageNum}&limit=6`);
      if (response.data) {
        const newProjects = response.data.data || [];
        setProjects(prev => pageNum === 1 ? newProjects : [...prev, ...newProjects]);
        setPage(response.data.page || 1);
        setHasMore(pageNum < (response.data.totalPages || 1));
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProjects(page + 1);
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
  }, [page, hasMore, loading, fetchProjects]);

  return (
    <div className="page-container">
      <section className="page-hero" style={{ backgroundImage: "url('/1784717375498%281%29.png')" }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <h1>Our <span>Projects</span></h1>
            <p>A showcase of our finest architectural achievements</p>
          </div>
        </div>
      </section>

      <section className="projects-section section-padding">
        <div className="container">
          <div className="projects-masonry">
            {projects.map((project, index) => (
              <div className="project-item fade-in-up" key={project.id} style={{ animationDelay: `${(index % 3) * 0.1}s` }}>
                <img
                  src={project.project_image ? `${IMAGE_BASE_URL}${project.project_image}` : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                  alt={project.project_name}
                />
                <div className="project-overlay">
                  <div className="project-info">
                    <span className="project-category">{project.category_name}</span>
                    <h3>{project.project_name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div ref={loaderRef} style={{ textAlign: 'center', padding: '40px 20px' }}>
            {loading && (
              <div>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px', color: '#d4af37' }}></i>
                <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading more projects...</p>
              </div>
            )}
            {!hasMore && projects.length > 0 && (
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>— You've reached the end —</p>
            )}
            {!loading && projects.length === 0 && (
              <p style={{ color: '#6b7280', fontSize: '16px', padding: '40px 0' }}>No projects found.</p>
            )}
          </div>
        </div>
      </section>
      
      <section className="cta-section" style={{ backgroundImage: "url('/52138.jpeg')" }}>
        <div className="cta-overlay">
          <div className="cta-content fade-in-up">
            <div className="cta-accent-line"></div>
            <span className="cta-label">Ready to Begin?</span>
            <h2>Have a <span>project</span> in mind?</h2>
            <p>We'd love to hear about your vision and help bring it to life with precision and excellence.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-gold">Contact Us Now</Link>
              <Link to="/design" className="btn-outline-light">Explore Our Process</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
