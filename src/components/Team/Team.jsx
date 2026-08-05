import React from 'react';
import './Team.css';

const Team = () => {
    const teamMembers = [
        {
            name: 'Rajeev K R',
            role: 'Founder & Proprietor',
        },
        {
            name: 'Dileep K',
            role: 'Principal Architect',
        },
        {
            name: 'Aiswarya Manoj',
            role: 'Project Manager',
        },
        {
            name: 'Prasad K M',
            role: 'Project Manager',
        },
    ];

    return (
        <section className="team-section text-center">
            <div className="container">
                <span className="section-subtitle">EXPERTS</span>
                <h2>Our Professional Team</h2>

                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card">
                            <i className="fa-solid fa-circle-user"></i>
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>

                <p className="team-footer-note">
                    <i className="fa-solid fa-helmet-safety"></i> Core Workforce: 15 Engineering
                    Professionals & 100+ Permanent Labour Force
                </p>
            </div>
        </section>
    );
};

export default Team;
