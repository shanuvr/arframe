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
        <section className="about-section" id="about">
            <div className="container grid-2">
                <div className="about-image">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                        alt="Modern Mansion Architecture"
                    />
                </div>
                <div className="about-text">
                    <span className="section-subtitle">ABOUT AFRAME</span>
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
                    <a href="#contact" className="btn-outline-dark">Read More About Us</a>
                </div>
            </div>
        </section>
    );
};

export default About;
