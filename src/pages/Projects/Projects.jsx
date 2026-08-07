import React, { useEffect } from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';

const Projects = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projectsData = [
    { id: 1, title: 'The Glass House', category: 'Luxury Villas', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop' },
    { id: 2, title: 'Nexus Corporate HQ', category: 'Commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'Minimalist Haven', category: 'Interiors', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop' },
    { id: 4, title: 'Azure Heights', category: 'Luxury Villas', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop' },
    { id: 5, title: 'Apex Tower', category: 'Commercial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
    { id: 6, title: 'Urban Loft', category: 'Interiors', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
  ];

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
          <div className="projects-masonry">
            {projectsData.map((project, index) => (
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
      
      <section className="cta-section" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2076&auto=format&fit=crop')" }}>
        <div className="cta-overlay">
          <div className="cta-content fade-in-up">
            <div className="cta-accent-line"></div>
            <span className="cta-label">Ready to Begin?</span>
            <h2>Have a <span>project</span> in mind?</h2>
            <p>We'd love to hear about your vision and help bring it to life with precision and excellence.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-gold">Contact Us Now</Link>
              <Link to="/design" className="btn-outline-light">Explore Our Process</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
