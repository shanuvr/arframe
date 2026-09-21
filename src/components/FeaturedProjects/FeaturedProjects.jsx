import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import './FeaturedProjects.css';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'https://pub-fbba380656084edda4d915551564adce.r2.dev/';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

const getImageUrl = (img) => {
    if (!img) return FALLBACK_IMAGE;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return `${IMAGE_BASE_URL}${img}`;
};

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchFeaturedProjects = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/projects?page=1&limit=3');
                if (isMounted && response.data) {
                    const projectList = response.data.data || [];
                    setProjects(projectList.slice(0, 3));
                }
            } catch (err) {
                console.error('Failed to fetch featured projects:', err);
                if (isMounted) {
                    setProjects([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchFeaturedProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!loading && projects.length === 0) {
        return null;
    }

    return (
        <section className="featured-projects-section" id="projects">
            <div className="container">
                <div className="section-header-flex">
                    <div className="section-title-group">
                        <span className="section-subtitle">OUR WORKS</span>
                        <h2>Featured <span>Projects</span></h2>
                        <p className="section-desc">Explore our handpicked collection of signature architectural marvels.</p>
                    </div>
                    <Link to="/projects" className="view-all-btn">
                        <span>View All Projects</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>

                {loading ? (
                    <div className="featured-projects-grid">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="featured-project-card skeleton-card">
                                <div className="featured-img-wrapper skeleton-box"></div>
                                <div className="featured-card-body">
                                    <div className="skeleton-line title"></div>
                                    <div className="skeleton-line subtitle"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="featured-projects-grid">
                        {projects.map((project) => {
                            const imgSrc = getImageUrl(project.project_image || (project.images && project.images[0]));
                            return (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}`}
                                    className="featured-project-card"
                                >
                                    <div className="featured-img-wrapper">
                                        <img
                                            src={imgSrc}
                                            alt={project.project_name}
                                            loading="lazy"
                                        />
                                        <div className="featured-img-overlay">
                                            <span className="featured-view-badge">
                                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                            </span>
                                        </div>
                                        {project.category_name && (
                                            <span className="featured-category-tag">
                                                {project.category_name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="featured-card-body">
                                        <h4>{project.project_name}</h4>
                                        <div className="featured-meta-info">
                                            {project.location && (
                                                <span className="featured-location">
                                                    <i className="fa-solid fa-location-dot"></i> {project.location}
                                                </span>
                                            )}
                                            {project.builtup_area && (
                                                <span className="featured-area">
                                                    <i className="fa-solid fa-ruler-combined"></i> {project.builtup_area}
                                                </span>
                                            )}
                                        </div>
                                        <div className="featured-card-footer">
                                            <span className="featured-explore-link">
                                                Explore Details <i className="fa-solid fa-arrow-right"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="featured-card-accent"></div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProjects;
