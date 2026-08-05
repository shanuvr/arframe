import React from 'react';
import './FeaturedProjects.css';

const FeaturedProjects = () => {
    const projects = [
        {
            img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80',
            title: 'Contemporary Residence',
            location: 'Thrissur, Kerala | 3000 Sq.Ft',
        },
        {
            img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80',
            title: 'Raabta Luxury Villa',
            location: 'Thrissur, Kerala | 2400 Sq.Ft',
        },
        {
            img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=80',
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
                    <a href="#projects" className="view-all-link">
                        View All Projects <i className="fa-solid fa-arrow-right"></i>
                    </a>
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
