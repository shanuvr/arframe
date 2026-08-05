import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const reviews = [
        {
            text: '"Aframe Builders turned our dream home into reality with exceptional design and quality. Highly professional team!"',
            name: 'Shibin K',
            location: 'Thrissur',
        },
        {
            text: '"Their attention to detail and commitment to timelines is remarkable. We are extremely satisfied with their execution."',
            name: 'Priya Nair',
            location: 'Kollam',
        },
    ];

    return (
        <section className="testimonials-section">
            <div className="container">
                <span className="section-subtitle text-center">TESTIMONIALS</span>
                <h2 className="text-center">What Our Clients Say</h2>

                <div className="testimonials-grid">
                    <div className="reviews-container">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <p className="review-text">{review.text}</p>
                                <div className="review-user">
                                    <i className="fa-solid fa-circle-user"></i>
                                    <div className="user-info">
                                        <h5>{review.name}</h5>
                                        <p>{review.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rating-box">
                        <h4>Google Rating</h4>
                        <div className="stars">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <div className="rating-num">4.9/5</div>
                        <p style={{ fontSize: '13px', color: '#aaa' }}>Based on 50+ user reviews</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
