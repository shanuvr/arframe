import React from 'react';
import './BeforeAfter.css';

const BeforeAfter = () => {
    const transformations = [
        {
            img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
            title: 'Old House Renovation',
        },
        {
            img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
            title: 'Empty Plot To Luxury Villa',
        },
        {
            img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',
            title: 'Structure To Completion',
        },
        {
            img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
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
