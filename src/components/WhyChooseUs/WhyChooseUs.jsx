import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
    const reasons = [
        { icon: 'fa-solid fa-user-tie', title: 'Professional Engineers' },
        { icon: 'fa-solid fa-users', title: '100+ Skilled Workforce' },
        { icon: 'fa-solid fa-layer-group', title: 'Quality Materials' },
        { icon: 'fa-solid fa-microchip', title: 'Modern Technology' },
        { icon: 'fa-solid fa-calendar-check', title: 'Timely Delivery' },
        { icon: 'fa-solid fa-compass-drafting', title: 'Customized Designs' },
        { icon: 'fa-solid fa-hand-holding-dollar', title: 'Transparent Pricing' },
        { icon: 'fa-solid fa-headset', title: 'Post Support' },
    ];

    return (
        <section className="why-section text-center">
            <div className="container">
                <span className="section-subtitle">BENEFITS</span>
                <h2>Why Choose Aframe?</h2>

                <div className="why-grid">
                    {reasons.map((reason, index) => (
                        <div key={index} className="why-item">
                            <i className={reason.icon}></i>
                            <p>{reason.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
