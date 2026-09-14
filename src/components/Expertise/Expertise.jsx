import React from 'react';
import './Expertise.css';

const Expertise = () => {
    const services = [
        {
            img: '/1784187873891%281%29.png',
            icon: 'fa-solid fa-house',
            title: 'Residential Construction',
        },
        {
            img: '/1784189865361%281%29.png',
            icon: 'fa-solid fa-building',
            title: 'Commercial Construction',
        },
        {
            img: '/1784192661079%281%29.png',
            icon: 'fa-solid fa-pen-ruler',
            title: 'Architecture & Planning',
        },
        {
            img: '/1784193892122%281%29.png',
            icon: 'fa-solid fa-couch',
            title: 'Interior Design',
        },
        {
            img: '/1784197586258%281%29.png',
            icon: 'fa-solid fa-hammer',
            title: 'Renovation & Remodeling',
        },
        {
            img: '/1784198356718%281%29.png',
            icon: 'fa-solid fa-helmet-safety',
            title: 'Project Management',
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
