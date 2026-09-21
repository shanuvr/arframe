import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHeroImages } from '../../hooks/useHeroImages.js';
import { buildImageUrl, DEFAULT_HERO_IMAGES } from '../../api/pageSettings.js';
import './Hero.css';

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { settings } = useHeroImages();

    const heroImages = useMemo(() => {
        const list = settings?.home_hero?.images?.length
            ? settings.home_hero.images
            : DEFAULT_HERO_IMAGES.home_hero.images;
        return list.map(buildImageUrl);
    }, [settings]);

    // const imageLabels = [
    //     'Modern Architecture',
    //     'Luxury Residences',
    //     '3D Design Visualization',
    //     'Interior Excellence',
    // ];

    // Auto-scroll images every 2 seconds (2000ms) with instant preloading
    useEffect(() => {
        if (heroImages.length === 0) return;

        // Preload all hero images so switching is instant without browser delay
        heroImages.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 2000);

        return () => clearInterval(timer);
    }, [heroImages]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    };

    const safeIndex = heroImages.length ? currentImageIndex % heroImages.length : 0;

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
                                className={`carousel-slide ${index === safeIndex ? 'active' : ''}`}
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
                                className={`indicator ${index === safeIndex ? 'active' : ''}`}
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
