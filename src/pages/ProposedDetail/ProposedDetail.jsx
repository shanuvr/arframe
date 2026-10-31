import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProposedProjectById, getProposedProjects } from '../../data/proposedProjectsData.js';
import './ProposedDetail.css';

const ProposedDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    // Scroll to top on navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Load project data
    useEffect(() => {
        const found = getProposedProjectById(id);
        setProject(found);
    }, [id]);

    // Navigation between projects
    const allProjects = useMemo(() => getProposedProjects(), []);
    const currentIndex = useMemo(() => {
        return allProjects.findIndex((p) => String(p.id) === String(id));
    }, [allProjects, id]);

    const nextProject = useMemo(() => {
        if (currentIndex === -1 || allProjects.length <= 1) return null;
        const nextIdx = (currentIndex + 1) % allProjects.length;
        return allProjects[nextIdx];
    }, [allProjects, currentIndex]);

    const prevProject = useMemo(() => {
        if (currentIndex === -1 || allProjects.length <= 1) return null;
        const prevIdx = (currentIndex - 1 + allProjects.length) % allProjects.length;
        return allProjects[prevIdx];
    }, [allProjects, currentIndex]);

    const images = useMemo(() => {
        if (!project) return [];
        if (project.gallery && project.gallery.length > 0) {
            return project.gallery;
        }
        return project.image ? [project.image] : [];
    }, [project]);

    // Lightbox handlers
    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const prevLightbox = useCallback(() => {
        if (images.length <= 1) return;
        setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const nextLightbox = useCallback(() => {
        if (images.length <= 1) return;
        setLightboxIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    // Keyboard controls
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, prevLightbox, nextLightbox]);

    if (!project) {
        return (
            <div className="propd-not-found white-theme">
                <div className="container text-center">
                    <i className="fa-solid fa-compass-drafting propd-icon-missing"></i>
                    <h2>Showcase Project Not Found</h2>
                    <p>The project or concept you are looking for is currently unavailable.</p>
                    <Link to="/" className="btn-gold">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="propd-page white-theme">
            {/* Elegant White Theme Header */}
            <header className="propd-white-header">
                <div className="container">
                    <div className="propd-breadcrumbs">
                        <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
                        <span>/</span>
                        <a href="/#design">Proposed Projects</a>
                        <span>/</span>
                        <span className="current">{project.title}</span>
                    </div>

                    <div className="propd-header-flex">
                        <div className="propd-title-group">
                            {project.phase && (
                                <span className="propd-phase-badge">
                                    <i className="fa-solid fa-compass-drafting"></i> {project.phase}
                                </span>
                            )}
                            <h1 className="propd-title">{project.title}</h1>
                        </div>

                        <div className="propd-header-actions">
                            <span className="propd-count-pill">
                                <i className="fa-solid fa-images"></i> {images.length} Photos
                            </span>
                            <Link to="/contact" className="btn-gold">
                                Enquire Now
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pure Photo Gallery (No text descriptions or specs) */}
            <main className="propd-gallery-section white-theme">
                <div className="container">
                    <div className="propd-gallery-grid">
                        {images.map((imgSrc, index) => (
                            <div
                                key={index}
                                className={`propd-gallery-card ${index === 0 ? 'featured' : ''}`}
                                onClick={() => openLightbox(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View photo ${index + 1}`}
                                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                            >
                                <img
                                    src={imgSrc}
                                    alt={`${project.title} - angle ${index + 1}`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80';
                                    }}
                                />
                                <div className="propd-gallery-overlay">
                                    <span className="propd-gallery-badge">
                                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                                    </span>
                                    <span className="propd-photo-index">Photo {index + 1} of {images.length}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Next / Previous Project Navigation */}
            <section className="propd-bottom-nav white-theme">
                <div className="container">
                    <div className="propd-nav-flex">
                        {prevProject ? (
                            <Link to={`/proposed-projects/${prevProject.id}`} className="propd-nav-card prev">
                                <span className="nav-direction"><i className="fa-solid fa-arrow-left"></i> Previous Project</span>
                                <h4>{prevProject.title}</h4>
                            </Link>
                        ) : <div />}

                        <Link to="/#design" className="propd-all-concepts-btn">
                            <i className="fa-solid fa-arrow-left"></i> Back to All Projects
                        </Link>

                        {nextProject ? (
                            <Link to={`/proposed-projects/${nextProject.id}`} className="propd-nav-card next">
                                <span className="nav-direction">Next Project <i className="fa-solid fa-arrow-right"></i></span>
                                <h4>{nextProject.title}</h4>
                            </Link>
                        ) : <div />}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && images[lightboxIndex] && (
                <div className="propd-lightbox-overlay" onClick={closeLightbox}>
                    <button
                        type="button"
                        className="propd-lb-btn close"
                        onClick={closeLightbox}
                        aria-label="Close Lightbox"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    {images.length > 1 && (
                        <button
                            type="button"
                            className="propd-lb-btn prev"
                            onClick={(e) => {
                                e.stopPropagation();
                                prevLightbox();
                            }}
                            aria-label="Previous Photo"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}

                    <div className="propd-lb-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[lightboxIndex]}
                            alt={`${project.title} - Large view`}
                            className="propd-lb-img"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=85';
                            }}
                        />
                        <div className="propd-lb-caption">
                            <h4>{project.title}</h4>
                            <span className="propd-lb-counter">
                                {lightboxIndex + 1} / {images.length}
                            </span>
                        </div>
                    </div>

                    {images.length > 1 && (
                        <button
                            type="button"
                            className="propd-lb-btn next"
                            onClick={(e) => {
                                e.stopPropagation();
                                nextLightbox();
                            }}
                            aria-label="Next Photo"
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProposedDetail;
