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

const getProjectSubtitle = (project) => {
    const parts = [];
    if (project.location) parts.push(project.location);
    if (project.builtup_area) parts.push(project.builtup_area);
    if (parts.length > 0) return parts.join(' | ');
    return project.category_name || '';
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

                {loading ? (
                    <div className="projects-grid">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="project-card skeleton-card">
                                <div className="project-img-wrapper skeleton-box"></div>
                                <div className="skeleton-line title"></div>
                                <div className="skeleton-line subtitle"></div>
                            </div>
                        ))}
                    </div>
                ) : projects.length > 0 ? (
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="project-card"
                            >
                                <div className="project-img-wrapper">
                                    <img
                                        src={getImageUrl(project.project_image || (project.images && project.images[0]))}
                                        alt={project.project_name}
                                        loading="lazy"
                                    />
                                </div>
                                <h4>{project.project_name}</h4>
                                <p>{getProjectSubtitle(project)}</p>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
};

export default FeaturedProjects;
