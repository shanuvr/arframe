import React from 'react';
import './Expertise.css';

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
            </div>
        </section>
    );
};

export default Expertise;
