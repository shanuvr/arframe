import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import './Expertise.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
        return url;
    }
    if (url.startsWith('/')) {
        return url;
    }
    return `${IMAGE_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const INITIAL_TRANSFORMATIONS = [
    {
        id: 1,
        before_image: '/before-after/beforea1.jpg',
        after_image: '/before-after/beoforea2.jpg',
        title: 'Home Renovation',
    },
    {
        id: 2,
        before_image: '/before-after/beforeb1.jpg',
        after_image: '/before-after/beforeb2.jpg',
        title: 'Home Renovation',
    },
];

const SERVICES = [
    {
        num: '01',
        icon: 'fa-solid fa-compass-drafting',
        title: 'Architectural Design',
        description: 'Innovative structural concepts, comprehensive 2D/3D blueprints, and tailored master plans.',
    },
    {
        num: '02',
        icon: 'fa-solid fa-house-chimney',
        title: 'Residential Construction',
        description: 'Bespoke luxury villas, modern residences, and custom homes built with precision craftsmanship.',
    },
    {
        num: '03',
        icon: 'fa-solid fa-building',
        title: 'Commercial Construction',
        description: 'High-performance corporate complexes, retail spaces, and business hubs built for growth.',
    },
    {
        num: '04',
        icon: 'fa-solid fa-warehouse',
        title: 'Industries and Godown',
        description: 'Heavy-duty industrial infrastructure, large-scale storage godowns, and robust logistics spaces.',
    },
    {
        num: '05',
        icon: 'fa-solid fa-cubes-stacked',
        title: 'PEB (Pre-Engineered Buildings)',
        description: 'High-strength, rapidly deployable pre-engineered steel buildings engineered for durability.',
    },
    {
        num: '06',
        icon: 'fa-solid fa-trowel-bricks',
        title: 'Renovation',
        description: 'Modernizing, upgrading, and structurally revitalizing existing properties with refined finishes.',
    },
    {
        num: '07',
        icon: 'fa-solid fa-couch',
        title: 'Interior Designing',
        description: 'Curated luxury aesthetics, ergonomic space planning, and bespoke interior transformations.',
    },
];

const Expertise = () => {
    const [transformations, setTransformations] = useState(INITIAL_TRANSFORMATIONS);

    useEffect(() => {
        const fetchTransformations = async () => {
            try {
                const res = await api.get('/api/before-after');
                if (res.data?.data && res.data.data.length > 0) {
                    setTransformations(res.data.data);
                }
            } catch (err) {
                console.warn('Could not fetch transformations from API, using fallback:', err);
            }
        };
        fetchTransformations();
    }, []);

    return (
        <section className="expertise-section" id="expertise">
            <div className="container">
                <div className="section-title-container text-center">
                    <span className="section-subtitle">WHAT WE DO</span>
                    <h2>Our Expertise</h2>
                    <div className="expertise-title-line"></div>
                </div>

                <div className="expertise-grid">
                    {SERVICES.map((service, index) => (
                        <div key={index} className="expertise-card">
                            <div className="expertise-card-header">
                                <div className="expertise-icon-box">
                                    <i className={service.icon}></i>
                                </div>
                                <span className="expertise-number">{service.num}</span>
                            </div>
                            <div className="expertise-content">
                                <h3>{service.title}</h3>
                                <p className="expertise-desc">{service.description}</p>
                            </div>
                            <div className="expertise-card-accent"></div>
                        </div>
                    ))}
                </div>

                <div className="ba-showcase">
                    <div className="ba-showcase-header text-center">
                        <span className="section-subtitle">PROVEN RESULTS</span>
                        <h3>Real Transformations</h3>
                        <div className="expertise-title-line"></div>
                    </div>
                    <div className="ba-showcase-grid">
                        {transformations.map((item, index) => (
                            <div key={item.id || index} className="ba-showcase-card">
                                <div className="ba-compare">
                                    <div className="ba-compare-item">
                                        <img
                                            src={getImageUrl(item.before_image || item.before)}
                                            alt={`${item.title} Before`}
                                            loading="lazy"
                                        />
                                        <span className="ba-tag">Before</span>
                                    </div>
                                    <div className="ba-compare-item">
                                        <img
                                            src={getImageUrl(item.after_image || item.after)}
                                            alt={`${item.title} After`}
                                            loading="lazy"
                                        />
                                        <span className="ba-tag after">After</span>
                                    </div>
                                </div>
                                <p className="ba-title">{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Expertise;
