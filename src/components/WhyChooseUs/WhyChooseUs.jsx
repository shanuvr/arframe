import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
    const reasons = [
        {
            number: '01',
            icon: 'fa-solid fa-pen-ruler',
            title: 'Tailored Architectural Designs',
            description: 'Custom-crafted layouts that reflect your unique functional requirements and aesthetic vision.',
        },
        {
            number: '02',
            icon: 'fa-solid fa-helmet-safety',
            title: 'Professional Engineering Excellence',
            description: 'Managed by qualified, experienced engineers committed to structural integrity and innovative design.',
        },
        {
            number: '03',
            icon: 'fa-solid fa-people-group',
            title: '100+ Skilled Workforce',
            description: 'A dedicated team of experienced craftsmen, supervisors, and technicians ensuring precise execution on every site.',
        },
        {
            number: '04',
            icon: 'fa-solid fa-gem',
            title: 'Material Quality',
            description: 'Premium-grade materials sourced from leading industry brands to guarantee durability and long-term strength.',
        },
        {
            number: '05',
            icon: 'fa-solid fa-microchip',
            title: 'Modern Construction Technology',
            description: 'Advanced tools, contemporary techniques, and modern structural practices for superior building efficiency.',
        },
        {
            number: '06',
            icon: 'fa-solid fa-calendar-check',
            title: 'On-Time Project Delivery',
            description: 'Strict schedule monitoring and streamlined project management to hand over your space without unnecessary delays.',
        },
        {
            number: '07',
            icon: 'fa-solid fa-file-invoice-dollar',
            title: '100% Transparent Pricing',
            description: 'Detailed estimates, clear contract terms, and zero hidden costs throughout the project lifecycle.',
        },
        {
            number: '08',
            icon: 'fa-solid fa-headset',
            title: 'Reliable Post-Handover Support',
            description: 'Comprehensive after-sales service and ongoing support to ensure lasting peace of mind.',
        },
    ];

    return (
        <section className="why-section" id="why-choose-us">
            <div className="container">
                <div className="why-header text-center">
                    <span className="section-subtitle">BENEFITS & EXCELLENCE</span>
                    <h2 className="why-title">Why Choose AFRAME Builders?</h2>
                    <div className="why-title-line"></div>
                </div>

                <div className="why-grid">
                    {reasons.map((reason, index) => (
                        <div key={index} className="why-card">
                            <div className="why-card-top">
                                <div className="why-icon-box">
                                    <i className={reason.icon}></i>
                                </div>
                                <span className="why-number">{reason.number}</span>
                            </div>
                            <h3 className="why-card-title">{reason.title}</h3>
                            <p className="why-card-desc">{reason.description}</p>
                            <div className="why-card-border-glow"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

