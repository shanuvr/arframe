import React from 'react';
import './DesignExcellence.css';

const DesignExcellence = () => {
    const processSteps = [
        { number: '01', label: 'Consultation' },
        { number: '02', label: 'Design' },
        { number: '03', label: 'Construction' },
    ];

    const visualCards = [
        {
            img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
            title: 'Concept Sketch',
        },
        {
            img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
            title: '3D Visualization',
        },
        {
            img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80',
            title: 'Finished Project',
        },
    ];

    return (
        <section className="dark-section" id="design">
            <div className="container grid-2">
                <div>
                    <span className="section-subtitle">DESIGN EXCELLENCE</span>
                    <h2>Crafted For You.<br />Designed For Life.</h2>
                    <p>
                        Every client has a unique vision. We create architecture designed around your lifestyle, your family,
                        your future, your land, and your dreams.
                    </p>

                    <div className="process-flow">
                        {processSteps.map((step, index) => (
                            <div key={index} className="process-step">
                                <div className="step-icon">{step.number}</div>
                                <div className="step-label">{step.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="process-visual-grid">
                    {visualCards.map((card, index) => (
                        <div key={index} className="visual-card">
                            <img src={card.img} alt={card.title} />
                            <p>{card.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DesignExcellence;
