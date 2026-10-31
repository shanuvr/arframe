import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { getProposedProjects } from '../../data/proposedProjectsData.js';
import './DesignExcellence.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const getImageUrl = (img) => {
    if (!img) return '/designexcellence/Concept Sketch.jpg';
    if (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')) return img;
    return `${IMAGE_BASE_URL}${img}`;
};

const DesignExcellence = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const sliderRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Mouse drag-to-scroll state
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

    const processSteps = [
        { number: '01', label: 'Consultation' },
        { number: '02', label: 'Design' },
        { number: '03', label: 'Construction' },
    ];

    const loadProjects = useCallback(() => {
        setLoading(true);
        try {
            const data = getProposedProjects();
            setProjects(data);
        } catch {
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();

        // Listen for admin changes dispatched across windows/tabs
        const handleSync = () => loadProjects();
        window.addEventListener('proposed_projects_updated', handleSync);
        return () => window.removeEventListener('proposed_projects_updated', handleSync);
    }, [loadProjects]);

    const checkScrollButtons = () => {
        const el = sliderRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 5);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    };

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        checkScrollButtons();
        el.addEventListener('scroll', checkScrollButtons);
        window.addEventListener('resize', checkScrollButtons);

        return () => {
            el.removeEventListener('scroll', checkScrollButtons);
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [projects]);

    const handleScroll = (direction) => {
        const el = sliderRef.current;
        if (!el) return;
        const card = el.querySelector('.proposed-slider-card');
        const cardWidth = card ? card.getBoundingClientRect().width : (el.clientWidth / 3);
        const gap = 16;
        const scrollAmount = cardWidth + gap;
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        const el = sliderRef.current;
        if (!el) return;
        isDownRef.current = true;
        startXRef.current = e.pageX - el.offsetLeft;
        scrollLeftRef.current = el.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDownRef.current = false;
    };

    const handleMouseUp = () => {
        isDownRef.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDownRef.current) return;
        e.preventDefault();
        const el = sliderRef.current;
        if (!el) return;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startXRef.current) * 1.5;
        el.scrollLeft = scrollLeftRef.current - walk;
    };

    return (
        <section className="dark-section proposed-section" id="design">
            <div className="proposed-wide-container">
                <div className="proposed-left-col">
                    <span className="section-subtitle">PROPOSED AND ONGOING</span>
                    <h2>Crafted For You.<br />Designed For Life.</h2>
                    <p>
                        Every client has a unique vision. We create architecture designed around your lifestyle, your family,
                        your future, and your dreams.
                    </p>

                    <div className="process-flow compact">
                        {processSteps.map((step, index) => (
                            <div key={index} className="process-step">
                                <div className="step-icon">{step.number}</div>
                                <div className="step-label">{step.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="proposed-right-showcase">
                    <div className="proposed-showcase-header">
                        <span className="proposed-slider-count">
                            <i className="fa-solid fa-shapes"></i> {projects.length} Showcase Stages
                        </span>
                        <span className="proposed-click-hint">
                            Click any project to explore full gallery <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </div>

                    <div className="proposed-5-grid">
                        {loading && projects.length === 0 ? (
                            <div className="proposed-slider-loading">
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Loading showcase projects...</span>
                            </div>
                        ) : (
                            projects.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/proposed-projects/${item.id}`}
                                    className="proposed-slider-card"
                                    title={`View ${item.title} details & photos`}
                                >
                                    <div className="proposed-img-box">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                        <div className="proposed-card-overlay">
                                            <span className="proposed-view-badge">
                                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                            </span>
                                        </div>
                                        {item.phase && (
                                            <span className="proposed-phase-tag">{item.phase}</span>
                                        )}
                                    </div>
                                    <p className="proposed-card-title">{item.title}</p>
                                    {item.subtitle && (
                                        <p className="proposed-card-subtitle">{item.subtitle}</p>
                                    )}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignExcellence;
