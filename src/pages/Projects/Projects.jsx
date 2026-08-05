import React, { useEffect, useState } from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';

const Projects = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Luxury Villas', 'Commercial', 'Interiors'];

  const projectsData = [
    { id: 1, title: 'The Glass House', category: 'Luxury Villas', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop' },
    { id: 2, title: 'Nexus Corporate HQ', category: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'Minimalist Haven', category: 'Interiors', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop' },
    { id: 4, title: 'Azure Heights', category: 'Luxury Villas', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop' },
    { id: 5, title: 'Apex Tower', category: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
    { id: 6, title: 'Urban Loft', category: 'Interiors', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projectsData 
    : projectsData.filter(project => project.category === activeFilter);

  return (
    <div className="page-container">
      <section className="page-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in-up">
            <h1>Our <span>Projects</span></h1>
            <p>A showcase of our finest architectural achievements</p>
          </div>
        </div>
      </section>

      <section className="projects-section section-padding">
        <div className="container">
          <div className="filter-container fade-in-up">
            {categories.map((category, index) => (
              <button 
                key={index}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="projects-masonry">
            {filteredProjects.map((project, index) => (
              <div className="project-item fade-in-up" key={project.id} style={{ animationDelay: `${(index % 3) * 0.1}s` }}>
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-info">
                    <span className="project-category">{project.category}</span>
                    <h3>{project.title}</h3>
                    <button className="view-btn">View Details <i className="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="cta-section section-padding text-center" style={{ backgroundColor: 'var(--black-light)' }}>
        <div className="container">
          <h2>Have a project in mind?</h2>
          <p>We'd love to hear about it and help you build it.</p>
          <Link to="/contact" className="btn-gold mt-4">Contact Us Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Projects;
