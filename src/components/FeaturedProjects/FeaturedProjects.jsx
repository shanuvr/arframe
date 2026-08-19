import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
    const projects = [
        {
            img: '/1784716807588%281%29%281%29.png',
            title: 'Contemporary Residence',
            location: 'Thrissur, Kerala | 3000 Sq.Ft',
        },
        {
            img: '/1784717375498%281%29.png',
            title: 'Raabta Luxury Villa',
            location: 'Thrissur, Kerala | 2400 Sq.Ft',
        },
        {
            img: '/52138.jpeg',
            title: 'Aaswatham Premium',
            location: 'Thrissur, Kerala | 3200 Sq.Ft',
        },
    ];

    return (
        <section className="projects-section" id="projects">
            <div className="container">
                <div className="section-header-flex">
                    <div>
                        <span className="section-subtitle">OUR WORKS</span>
                        <h2>Featured Projects</h2>
                    </div>
                    <Link to="/projects" className="view-all-link">
                        View All Projects <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <a key={index} href="#projects" className="project-card">
                            <div className="project-img-wrapper">
                                <img src={project.img} alt={project.title} />
                            </div>
                            <h4>{project.title}</h4>
                            <p>{project.location}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
