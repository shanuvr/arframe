import React from 'react';
import './BeforeAfter.css';

const BeforeAfter = () => {
    const transformations = [
        {
            img: '/1784711581942%281%29.png',
            title: 'Old House Renovation',
        },
        {
            img: '/sharon1%20%286%29%281%29.jpg',
            title: 'Empty Plot To Luxury Villa',
        },
        {
            img: '/sharon1%20%289%29.jpg',
            title: 'Structure To Completion',
        },
        {
            img: '/1784132288077%281%29.png',
            title: 'Interior Transformation',
        },
    ];

    return (
        <section className="ba-section">
            <div className="container text-center">
                <span className="section-subtitle">TRANSFORMATIONS</span>
                <h2>Before & After Transformations</h2>

                <div className="ba-grid">
                    {transformations.map((item, index) => (
                        <div key={index} className="ba-card">
                            <img src={item.img} alt={item.title} />
                            <p>{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BeforeAfter;
