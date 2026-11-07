import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import './RealTransformations.css';

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

const RealTransformations = () => {
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
        <section className="transformations-section" id="transformations">
            <div className="container">
                <div className="transformations-header text-center">
                    <span className="section-subtitle">PROVEN RESULTS</span>
                    <h2>Real Transformations</h2>
                    <div className="transformations-title-line"></div>
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
        </section>
    );
};

export default RealTransformations;
