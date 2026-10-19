import React from 'react';
import { Link } from 'react-router-dom';
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
                        Founded in 2020, AFRAME Builders is a full-service architectural design and construction firm based in Thrissur, Kerala. Built on a foundation of uncompromised quality and engineering precision, we deliver complete turn-key solutions spanning residential, commercial, and industrial sectors.
                    </p>

                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <h3>{stat.number}</h3>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/about" className="btn-outline-about">Read More About Us</Link>
                </div>
            </section>
        </>
    );
};

export default About;
