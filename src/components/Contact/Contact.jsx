import React, { useState } from 'react';
import api from '../../api/axios.js';
import './Contact.css';

const Contact = ({ alignTop = false }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        subject: 'Project Enquiry',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        const payload = {
            full_name: formData.full_name,
            email: formData.email,
            subject: formData.subject,
            message: formData.phone ? `${formData.message}\n\n(Phone: ${formData.phone})`.trim() : formData.message,
        };

        try {
            const response = await api.post('/api/contact', payload);
            setStatus({
                type: 'success',
                message: response.data?.message || 'Enquiry sent successfully!',
            });
            setFormData({
                full_name: '',
                phone: '',
                email: '',
                subject: 'Project Enquiry',
                message: '',
            });
        } catch (error) {
            console.error('Contact form submission error:', error);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || error.response?.data?.error || 'Failed to send message. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="footer-cta-section" id="contact">
            <div className={"container grid-3" + (alignTop ? ' align-top' : '')}>
                <div className="contact-form-wrapper">
                    <h3>Let's Build Together</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your Full Name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <select
                                className="form-control"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            >
                                <option value="Project Enquiry">Project Enquiry</option>
                                <option value="Residential Construction">Residential Construction</option>
                                <option value="Commercial Building">Commercial Building</option>
                                <option value="Interior Architecture">Interior Architecture</option>
                            </select>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Your Message Here..."
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-gold" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                        {status.message && (
                            <div className={`status-alert ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>

                <div className="address-wrapper">
                    <div className="address-details">
                        <h3>Office Address</h3>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px' }}>
                            AFrame Builders<br />403, RIED Square Building, Chungam Jn,<br />Westfort, Thrissur - 680003
                        </p>
                        <p>
                            <i className="fa-solid fa-phone"></i> +91 9712337226
                        </p>
                        <p>
                            <i className="fa-solid fa-envelope"></i> aframebuilders.ind@gmail.com
                        </p>
                        <p>
                            <i className="fa-solid fa-clock"></i> Mon - Sat: 9:00 AM - 6:00 PM
                        </p>

                        <div className="social-icons">
                            <a href="https://www.instagram.com/aframe_builders?stkn=MTA1bXRmdWRoNmQ1cA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/share/1Haa2Earky/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                        </div>
                    </div>

                    <div className="map-container">
                        <iframe
                            src="https://maps.google.com/maps?q=10.520088,76.196966&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: '0' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
