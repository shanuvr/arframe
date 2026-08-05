import React from 'react';
import './Expertise.css';

const Expertise = () => {
    const services = [
        {
            img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80',
            icon: 'fa-solid fa-house',
            title: 'Residential Construction',
        },
        {
            img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80',
            icon: 'fa-solid fa-building',
            title: 'Commercial Construction',
        },
        {
            img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80',
            icon: 'fa-solid fa-pen-ruler',
            title: 'Architecture & Planning',
        },
        {
            img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80',
            icon: 'fa-solid fa-couch',
            title: 'Interior Design',
        },
        {
            img: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=500&q=80',
            icon: 'fa-solid fa-hammer',
            title: 'Renovation & Remodeling',
        },
        {
            img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&q=80',
            icon: 'fa-solid fa-helmet-safety',
            title: 'Project Management',
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
                            <div className="expertise-image">
                                <img src={service.img} alt={service.title} />
                            </div>
                            <div className="expertise-content">
                                <i className={service.icon}></i>
                                <h3>{service.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;
