import React from 'react';
import './About.css';

const About = () => {
    const stats = [
        { number: '2020', label: 'Founded' },
        { number: '15+', label: 'Engineers' },
        { number: '100+', label: 'Skilled Staff' },
        { number: '50+', label: 'Completed' },
    ];

    return (
        <>
            <section className="about-intro" id="about">
                <div className="about-intro-inner">
                    <span className="section-subtitle">ABOUT AFRAME</span>
                </div>
            </section>

            <section className="about-section">
                <div className="about-content">
                    <h2>Building Beyond<br />Expectations</h2>
                    <p>
                        Founded in 2020, Aframe Builders is a premier design and construction firm led by professional engineers.
                        We bridge innovative architectural concepts with structural reality to create timeless spaces.
                    </p>

                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <h3>{stat.number}</h3>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <a href="#contact" className="btn-outline-about">Read More About Us</a>
                </div>
            </section>
        </>
    );
};

export default About;
