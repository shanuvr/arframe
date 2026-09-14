import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import './ProjectDetail.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

const buildImageUrl = (img) => {
  if (!img) return FALLBACK_IMAGE;
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return `${IMAGE_BASE_URL}${img}`;
};

const STATIC_PROJECT_4 = {
  project_name: 'Residence AADIMADHAVAM',
  category_name: 'Interiors',
  description: 'Aadimadhavam reflects timeless character and peaceful tropical living. Defined by bold Corten steel, lush greenery, and raw natural textures, the residence blends strength and warmth while maintaining a seamless connection with its surroundings.',
  client: 'Mr Pradeep',
  location: 'Ammadam, Thrissur',
  builtup_area: '2850 Sqft',
  land_area: '50 Cent',
  images: [
    '/Ammadom/IMG_0513.jpg',
    '/Ammadom/9195AC76-8A6C-495F-AD39-691A1A31035D.jpg',
    '/Ammadom/IMG_0515.jpg',
    '/Ammadom/IMG_0516.jpg',
    '/Ammadom/IMG_0517.jpg',
    '/Ammadom/IMG_0518.jpg',
    '/Ammadom/IMG_0519.jpg',
    '/Ammadom/IMG_0520.jpg',
    '/Ammadom/IMG_0521.jpg',
    '/Ammadom/IMG_0522.jpg',
  ],
};

const matchesStaticProject4 = (project) => {
  const id = String(project?.id || '');
  const name = String(project?.project_name || '');
  return id === '4' || name.toUpperCase().includes('AADIMADHAVAM');
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchSingle = useCallback(async (projectId) => {
    try {
      const res = await api.get(`/api/projects/${projectId}`);
      if (!res.data) return null;
      return res.data.data || res.data;
    } catch {
      return null;
    }
  }, []);

  const findInList = useCallback(async (projectId) => {
    try {
      const first = await api.get('/api/projects?page=1&limit=100');
      const totalPages = first.data?.totalPages || 1;
      for (let p = 1; p <= totalPages; p++) {
        const res = p === 1 ? first : await api.get(`/api/projects?page=${p}&limit=100`);
        const found = (res.data?.data || []).find((x) => String(x.id) === String(projectId));
        if (found) return found;
      }
    } catch {
      /* ignore */
    }
    return null;
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    (async () => {
      let found = await fetchSingle(id);
      if (!found) found = await findInList(id);
      if (active) {
        if (found) {
          setProject(matchesStaticProject4(found) ? { ...found, ...STATIC_PROJECT_4 } : found);
        } else {
          setError('Project not found.');
        }
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id, fetchSingle, findInList]);

  const images = project && project.images && project.images.length > 0
    ? project.images
    : (project && project.project_image ? [project.project_image] : []);

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox = useCallback(() => {
    const total = images.length || 1;
    setLightboxIndex((i) => (i === null ? i : (i + total - 1) % total));
  }, [images.length]);
  const nextLightbox = useCallback(() => {
    const total = images.length || 1;
    setLightboxIndex((i) => (i === null ? i : (i + 1) % total));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, prevLightbox, nextLightbox]);

  if (loading) {
    return (
      <div className="pd-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pd-loading">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>{error || 'Project not found.'}</p>
        <Link to="/projects" className="btn-gold pd-back-link">Back to Projects</Link>
      </div>
    );
  }

  const coverUrl = buildImageUrl(images[0]);

  const facts = [
    { icon: 'fa-solid fa-user', label: 'Client', value: project.client },
    { icon: 'fa-solid fa-location-dot', label: 'Location', value: project.location },
    { icon: 'fa-solid fa-ruler-combined', label: 'Built-up Area', value: project.builtup_area },
    { icon: 'fa-solid fa-map', label: 'Land Area', value: project.land_area },
  ].filter((fact) => fact.value);

  return (
    <div className="page-container pd-page">
      <section className="pd-hero" style={{ backgroundImage: `url('${coverUrl}')` }}>
        <div className="pd-hero-overlay">
          <div className="container pd-hero-content fade-in-up">
            {project.category_name && <span className="pd-category">{project.category_name}</span>}
            <h1>{project.project_name}</h1>
            <Link to="/projects" className="pd-back-link">
              <i className="fa-solid fa-arrow-left"></i> All Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="pd-body">
        <div className="container">
          {project.description && (
            <div className="pd-description fade-in-up">
              <span className="section-subtitle">THE PROJECT</span>
              <h2>About This Project</h2>
              <p>{project.description}</p>
            </div>
          )}

          {facts.length > 0 && (
            <div className="pd-facts fade-in-up">
              {facts.map((fact, index) => (
                <div className="pd-fact-card" key={index}>
                  <i className={fact.icon}></i>
                  <span className="pd-fact-label">{fact.label}</span>
                  <span className="pd-fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="pd-gallery fade-in-up">
              <div className="pd-gallery-header">
                <span className="section-subtitle">GALLERY</span>
                <h2>Project Photos</h2>
              </div>
              <div className="pd-gallery-grid">
                {images.map((img, index) => (
                  <button
                    type="button"
                    className={`pd-gallery-item ${index === 0 ? 'featured' : ''}`}
                    key={index}
                    onClick={() => openLightbox(index)}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <img src={buildImageUrl(img)} alt={`${project.project_name} photo ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pd-cta">
        <div className="container pd-cta-inner">
          <h2>Like What You See?</h2>
          <p>Let's bring your vision to life with the same care and precision.</p>
          <div className="pd-cta-actions">
            <Link to="/contact" className="btn-gold">Start Your Project</Link>
            <Link to="/projects" className="btn-outline-light">Explore More Projects</Link>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="pd-lightbox" onClick={closeLightbox}>
          <button type="button" className="pd-lb-close" onClick={closeLightbox} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button type="button" className="pd-lb-prev" onClick={(e) => { e.stopPropagation(); prevLightbox(); }} aria-label="Previous">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="pd-lb-image" onClick={(e) => e.stopPropagation()}>
            <img src={buildImageUrl(images[lightboxIndex])} alt={`${project.project_name} photo ${lightboxIndex + 1}`} />
            <p>{lightboxIndex + 1} / {images.length}</p>
          </div>
          <button type="button" className="pd-lb-next" onClick={(e) => { e.stopPropagation(); nextLightbox(); }} aria-label="Next">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;