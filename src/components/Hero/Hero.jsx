import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const heroImages = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
    ];

    // const imageLabels = [
    //     'Modern Architecture',
    //     'Luxury Residences',
    //     '3D Design Visualization',
    //     'Interior Excellence',
    // ];

    // Auto-scroll images every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [heroImages.length]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    };

    return (
        // <header className="hero" id="home">
        //     <div className="hero-content">
        //         <h1>Designing Spaces.<br />Building Legacies.</h1>
        //         <p>Premium Architecture & Construction Solutions Tailored To You.</p>

        //         <div className="hero-features">
        //             <div className="hero-feature-item">
        //                 <i className="fa-solid fa-house-chimney"></i> Luxury Residences
        //             </div>
        //             <div className="hero-feature-item">
        //                 <i className="fa-solid fa-building"></i> Commercial Buildings
        //             </div>
        //             <div className="hero-feature-item">
        //                 <i className="fa-solid fa-couch"></i> Interior Design
        //             </div>
        //         </div>

        //         <div className="hero-buttons">
        //             <a href="#projects" className="btn-gold">View Projects</a>
        //             <a href="#contact" className="btn-outline">Book Consultation</a>
        //         </div>
        //     </div>

        //     {/* Auto-scrolling Image Carousel */}
        //     <div className="hero-carousel">
        //         <div className="carousel-wrapper">
        //             <div className="carousel-container">
        //                 {heroImages.map((image, index) => (
        //                     <div
        //                         key={index}
        //                         className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
        //                         style={{ backgroundImage: `url(${image})` }}
        //                     >
        //                         <div className="carousel-label">{imageLabels[index]}</div>
        //                     </div>
        //                 ))}
        //             </div>

        //             {/* Navigation Arrows */}
        //             <button
        //                 className="carousel-arrow carousel-arrow-left"
        //                 onClick={handlePrevImage}
        //                 aria-label="Previous image"
        //             >
        //                 <i className="fa-solid fa-chevron-left"></i>
        //             </button>
        //             <button
        //                 className="carousel-arrow carousel-arrow-right"
        //                 onClick={handleNextImage}
        //                 aria-label="Next image"
        //             >
        //                 <i className="fa-solid fa-chevron-right"></i>
        //             </button>

        //             {/* Carousel Indicators */}
        //             <div className="carousel-indicators">
        //                 {heroImages.map((_, index) => (
        //                     <button
        //                         key={index}
        //                         className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
        //                         onClick={() => setCurrentImageIndex(index)}
        //                         aria-label={`Go to image ${index + 1}`}
        //                     ></button>
        //                 ))}
        //             </div>
        //         </div>
        //     </div>

        //     <div className="scroll-down">
        //         Scroll Down
        //         <i className="fa-solid fa-chevron-down"></i>
        //     </div>
        // </header>
        <header className="hero" id="home">
            {/* Auto-scrolling Image Carousel (Now acting as full background) */}
            <div className="hero-carousel">
                <div className="carousel-wrapper">
                    <div className="carousel-container">
                        {heroImages.map((image, index) => (
                            <div
                                key={index}
                                className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
                                style={{ backgroundImage: `url(${image})` }}
                            >
                                {/* <div className="carousel-label">{imageLabels[index]}</div> */}
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        className="carousel-arrow carousel-arrow-left"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        className="carousel-arrow carousel-arrow-right"
                        onClick={handleNextImage}
                        aria-label="Next image"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Go to image ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content on top */}
            <div className="hero-content">
                <h1>Designing Spaces.<br />Building Legacies.</h1>
                <p>Premium Architecture & Construction Solutions Tailored To You.</p>

                <div className="hero-features">
                    <div className="hero-feature-item">
                        <i className="fa-solid fa-house-chimney"></i> Luxury Residences
                    </div>
                    <div className="hero-feature-item">
                        <i className="fa-solid fa-building"></i> Commercial Buildings
                    </div>
                    <div className="hero-feature-item">
                        <i className="fa-solid fa-couch"></i> Interior Design
                    </div>
                </div>

                <div className="hero-buttons">
                    <Link to="/projects" className="btn-gold">View Projects</Link>
                    <Link to="/contact" className="btn-outline">Book Consultation</Link>
                </div>
            </div>

            {/* <div className="scroll-down">
                Scroll Down
                <i className="fa-solid fa-chevron-down"></i>
            </div> */}
        </header>
    );
};

export default Hero;
