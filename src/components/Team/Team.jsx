import React from 'react';
import './Team.css';

const Team = () => {
    const teamMembers = [
        {
            name: 'Rajeev K R',
            role: 'Founder',
            bio: 'Founded the company in 2020 after gaining 5 years of professional experience in India and abroad. An engineer from Government Engineering College Thrissur, he holds an M.Tech from NIT Surat. His vision and leadership continue to drive the company\'s growth.',
        },
        {
            name: 'Dileep',
            role: 'Chief Architect',
            bio: 'With 15 years of professional experience, Dileep brings a strong blend of expertise and creativity to every project. Known for his original thinking and innovative ideas, he leads our architectural vision with a focus on thoughtful and impactful design.',
        },
        {
            name: 'Aiswarya',
            role: 'Managing Partner',
            bio: 'Aiswarya is a B.Tech graduate from Government Engineering College Thrissur and holds an M.Tech from NIT Surathkal. With 9 years of professional experience, she plays a key role in the company\'s management, growth, and strategic direction.',
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
                            <p className="team-role">{member.role}</p>
                            <p className="team-bio">{member.bio}</p>
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
