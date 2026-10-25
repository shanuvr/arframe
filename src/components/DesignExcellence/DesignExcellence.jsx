import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios.js';
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

    useEffect(() => {
        let isMounted = true;

        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/proposed-projects');
                if (isMounted && res.data?.data && res.data.data.length > 0) {
                    setProjects(res.data.data);
                } else if (isMounted) {
                    setProjects([
                        { id: 1, title: 'Concept Sketch', image: '/designexcellence/Concept Sketch.jpg' },
                        { id: 2, title: '3D Visualization', image: '/designexcellence/3D Visualization.jpg' },
                        { id: 3, title: 'Finished Project', image: '/designexcellence/Finished Project.jpg' },
                    ]);
                }
            } catch (err) {
                console.error('Failed to fetch proposed projects:', err);
                if (isMounted) {
                    setProjects([
                        { id: 1, title: 'Concept Sketch', image: '/designexcellence/Concept Sketch.jpg' },
                        { id: 2, title: '3D Visualization', image: '/designexcellence/3D Visualization.jpg' },
                        { id: 3, title: 'Finished Project', image: '/designexcellence/Finished Project.jpg' },
                    ]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProjects();

        return () => {
            isMounted = false;
        };
    }, []);

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
        <section className="dark-section" id="design">
            <div className="container grid-2">
                <div>
                    <span className="section-subtitle">PROPOSED AND ONGOING PROJECTS</span>
                    <h2>Crafted For You.<br />Designed For Life.</h2>
                    <p>
                        Every client has a unique vision. We create architecture designed around your lifestyle, your family,
                        your future, your land, and your dreams.
                    </p>

                    <div className="process-flow">
                        {processSteps.map((step, index) => (
                            <div key={index} className="process-step">
                                <div className="step-icon">{step.number}</div>
                                <div className="step-label">{step.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="proposed-slider-wrapper">
                    {/* Slider Navigation Header */}
                    <div className="proposed-slider-nav">
                        <span className="proposed-slider-count">
                            {projects.length > 0 ? `${projects.length} Showcase Items` : ''}
                        </span>
                        <div className="proposed-slider-arrows">
                            <button
                                type="button"
                                className="proposed-arrow-btn"
                                onClick={() => handleScroll('left')}
                                disabled={!canScrollLeft}
                                aria-label="Previous Project"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button
                                type="button"
                                className="proposed-arrow-btn"
                                onClick={() => handleScroll('right')}
                                disabled={!canScrollRight}
                                aria-label="Next Project"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Scrollable Slider Track */}
                    <div
                        className="proposed-slider-track"
                        ref={sliderRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {loading && projects.length === 0 ? (
                            <div className="proposed-slider-loading">
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Loading proposed projects...</span>
                            </div>
                        ) : (
                            projects.map((item) => (
                                <div key={item.id} className="proposed-slider-card">
                                    <div className="proposed-img-box">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            loading="lazy"
                                            draggable={false}
                                        />
                                    </div>
                                    <p className="proposed-card-title">{item.title}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignExcellence;
