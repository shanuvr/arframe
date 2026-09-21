import React from 'react';
import './Expertise.css';

const Expertise = () => {
    const services = [
        {
            num: '01',
            icon: 'fa-solid fa-house-chimney',
            title: 'Residential Construction',
            description: 'Bespoke residential designs and precision-built luxury homes tailored to your lifestyle.',
        },
        {
            num: '02',
            icon: 'fa-solid fa-building',
            title: 'Commercial Construction',
            description: 'High-performance commercial spaces, corporate complexes, and retail developments.',
        },
        {
            num: '03',
            icon: 'fa-solid fa-compass-drafting',
            title: 'Architecture & Planning',
            description: 'Innovative structural designs, comprehensive blueprints, and 3D architectural modeling.',
        },
        {
            num: '04',
            icon: 'fa-solid fa-couch',
            title: 'Interior Design',
            description: 'Harmonious, luxury interior styling blending functionality with contemporary elegance.',
        },
        {
            num: '05',
            icon: 'fa-solid fa-trowel-bricks',
            title: 'Renovation & Remodeling',
            description: 'Modernizing and revitalizing existing structures with cutting-edge craftsmanship.',
        },
        {
            num: '06',
            icon: 'fa-solid fa-helmet-safety',
            title: 'Project Management',
            description: 'End-to-end site supervision, timeline oversight, quality control, and budget adherence.',
        },
    ];

    const transformations = [
        {
            before: '/before-after/beforea1.jpg',
            after: '/before-after/beoforea2.jpg',
            title: 'Home Renovation',
        },
        {
            before: '/before-after/beforeb1.jpg',
            after: '/before-after/beforeb2.jpg',
            title: 'Home Renovation',
        },
    ];

    return (
        <section className="expertise-section">
            <div className="container">
                <div className="section-title-container text-center">
                    <span className="section-subtitle">OUR EXPERTISE</span>
                    <h2>Our Specialist Services</h2>
                </div>

                <div className="expertise-grid">
                    {services.map((service, index) => (
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
                        <h3>Real Transformations</h3>
                    </div>
                    <div className="ba-showcase-grid">
                        {transformations.map((item, index) => (
                            <div key={index} className="ba-showcase-card">
                                <div className="ba-compare">
                                    <div className="ba-compare-item">
                                        <img src={item.before} alt={`${item.title} Before`} />
                                        <span className="ba-tag">Before</span>
                                    </div>
                                    <div className="ba-compare-item">
                                        <img src={item.after} alt={`${item.title} After`} />
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
